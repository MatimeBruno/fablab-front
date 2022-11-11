import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import ChooseSpace from './ChooseSpace';
import DateTimeSelect from './DateTimeSelect';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {reserve} from '../../actions/reservation';

const steps = ["Choix de l'espace", "Choix de la date et l'heure", 'Récapitulatif'];

const Reservation = (props) => {
	const [activeStep, setActiveStep] = useState(0);
	const [skipped, setSkipped] = useState(new Set());
	const [isStepIsInvalid, setIsStepIsInvalid] = useState(null);
	const [checkedSpace, setCheckedSpace] = useState([]);
	const [dates, setDates] = useState([]);
	const [checkedMorningHourly, setCheckedMorningHourly] = useState([]);
	const [checkedAfternoonHourly, setCheckedAfternoonHourly] = useState([]);
	const [reservations, setReservation] = useState([]);
	const [reservStatus, setReservStatus] = useState(null);

	const isStepSkipped = (step) => {
		return skipped.has(step);
	};

	//Fonction permettant de passer à l'étape suivante
	const handleNext = () => {
		if (isStepIsInvalid)
		{
			return;// Si l'étape est invalide
		}

		let newSkipped = skipped;

		if (isStepSkipped(activeStep))
		{
			newSkipped = new Set(newSkipped.values());
			newSkipped.delete(activeStep);
		}

		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped(newSkipped);
	};

	//Fonction permettant de passer à l'étape précédente
	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
		if(activeStep === 2)
		{
			setReservation([]);
			setCheckedMorningHourly([]);
			setCheckedAfternoonHourly([]);
			setDates([]);
		}
	};

	useEffect(()=>{
		if(activeStep === 2 && reservations.length === 0)
		{
			setReservation(lastStep());
		}
	})

	//Formatage et empaquetage des données de réservation pour les envoyées à l'API
	const lastStep = () => {
		const hourly = checkedMorningHourly.concat(checkedAfternoonHourly)
		const filtHourArr = [];
		const resaArr = [];
		//Filtre les horaires afin d'éviter les doublons ex.(de 9h-10h à 10h-11h -> 9h à 11h) 
		hourly.forEach(hour=>{
			const splitedHour = hour.split("_");
			const startHour = Number(splitedHour[0]);
			const endHour = Number(splitedHour[1]);

			if(filtHourArr.indexOf(startHour) !== -1)
			{
				filtHourArr[filtHourArr.indexOf(startHour)] = endHour;
			}
			else if(filtHourArr.indexOf(endHour) !== -1)
			{
				filtHourArr[filtHourArr.indexOf(endHour)] = startHour;
			}
			else
			{
				filtHourArr.push(startHour);
				filtHourArr.push(endHour);
			}
		})

		//Formatage des données de réservations
		dates.forEach(date => {
			let cpt = 0;
			const start_date_instance = new Date(date)
			const end_date_instance = new Date(date)

			start_date_instance.setUTCDate(start_date_instance.getDate());
			end_date_instance.setUTCDate(end_date_instance.getDate());

			while (cpt < filtHourArr.length)
			{
				start_date_instance.setUTCHours(filtHourArr[cpt]);
				end_date_instance.setUTCHours(filtHourArr[cpt+1]);

				resaArr.push(
					{
						date_debut_resa : start_date_instance.toISOString(),
						date_fin_resa : end_date_instance.toISOString()
					}
				)
				cpt+=2;
			}
		});
		
		return resaArr;
	}

	//Cette fonction envoi les données de réservation à l'API
	const submitResevation = async () => {
		const reservRes = await reserve(props.user, reservations, checkedSpace);
		setReservStatus(reservRes);
	}


	return (
		<Box sx={{ width: '100%', p:5 }}>
			{
				(reservStatus !== null)?
					<Alert
						severity={Object.keys(reservStatus)[0]}
						action={
							(Object.keys(reservStatus)[0] === "success")
							&&
							<Link to="/">
								<Button color="inherit" size="small">
									Retour à l'accueil
								</Button>
							</Link>
						}
					>
						{reservStatus[Object.keys(reservStatus)[0]]}
					</Alert>
					:
					<>
						<Stepper activeStep={activeStep}>
							{
								steps.map((label, index) => {
									const stepProps = {};
									const labelProps = {};
									if (isStepSkipped(index))
									{
										stepProps.completed = false;
									}
									return (
										<Step key={label} {...stepProps}>
											<StepLabel {...labelProps}>{label}</StepLabel>
										</Step>
									);
								})
							}
						</Stepper>
						<>
							<Box component="div" sx={{ p: 5, display:"flex", justifyContent:"center"}}>
								{
									(activeStep === 0)?
										<ChooseSpace 
											setIsStepIsInvalid={setIsStepIsInvalid}
											setCheckedSpace={setCheckedSpace}
											checkedSpace={checkedSpace}
										/>
										:
										(activeStep === 1)?
											<DateTimeSelect
												setIsStepIsInvalid={setIsStepIsInvalid}
												checkedMorningHourly={checkedMorningHourly}
												setCheckedMorningHourly={setCheckedMorningHourly}
												checkedAfternoonHourly={checkedAfternoonHourly}
												setCheckedAfternoonHourly={setCheckedAfternoonHourly}
												setDates={setDates}
												dates={dates}
												handleNext={handleNext}
											/>
											:
											(activeStep === 2)?
												<div>
													<h3>Récapitulatif</h3>
													<List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
														{
															(reservations.length > 0) && reservations.map((resaDate, i)=>{
																const dateStartValue = new Date(resaDate.date_debut_resa);
																const dateEndValue = new Date(resaDate.date_fin_resa);
																const dateStartFormat = dateStartValue.toLocaleDateString(
																	'fr-FR',
																	{ weekday: "long", year: "numeric", month: "short", day: "numeric" }
																);
																const startHour = dateStartValue.getUTCHours();
																const endHour = dateEndValue.getUTCHours();

																return(
																	<ListItem key={`resa-${i}`}>
																		<ListItemText 
																			primary={`Le ${dateStartFormat}`} 
																			secondary={`${startHour}h - ${endHour}h`}
																		/>
																	</ListItem>
																)

															})
														}
													</List>
												</div>
												:
												""
								}
							</Box>
							<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
								<Button
									color="inherit"
									disabled={activeStep === 0}
									onClick={handleBack}
									sx={{ mr: 1 }}
								>
									Précédent
								</Button>
								<Box sx={{ flex: '1 1 auto' }} />

								<Button onClick={(activeStep === steps.length - 1) ? submitResevation : handleNext}>
									{
										(activeStep !== 1)?
											activeStep === steps.length - 1 ? 'Réservé' : 'Suivant'
										:
										""
									}
								</Button>
							</Box>
						</>
					</>
			}
		</Box>
	);
}

export default Reservation;