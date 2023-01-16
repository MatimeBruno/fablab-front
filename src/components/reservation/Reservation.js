import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {reserve} from '../../actions/reservation';
import { zonedTimeToUtc, formatInTimeZone } from 'date-fns-tz'

const Reservation = (props) => {
	const [activeStep, setActiveStep] = useState(0);
	const [reservations, setReservation] = useState([]);
	const [reservStatus, setReservStatus] = useState(null);
	const [isRecapDone, setIsRecapDone] = useState(false);

	useEffect(()=>{
		if(!isRecapDone && reservations.length === 0 && props.showRecap)
		{
			setReservation(getResaData());
			setIsRecapDone(true);
		}
	})

	//Formatage et empaquetage des données de réservation pour les envoyées à l'API
	const getResaData = () => {
		const hourly = props.checkedMorningHourly.concat(props.checkedAfternoonHourly)
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
		props.dates.forEach(date => {
			let cpt = 0;
			const start_date_instance = new Date(date)
			const end_date_instance = new Date(date)

			while (cpt < filtHourArr.length)
			{
				start_date_instance.setHours(filtHourArr[cpt]);
				end_date_instance.setHours(filtHourArr[cpt+1]);

				const localStartDate = zonedTimeToUtc(start_date_instance, 'Indian/Reunion');
				const localEndDate = zonedTimeToUtc(end_date_instance, 'Indian/Reunion');
				resaArr.push(
					{
						date_debut_resa : localStartDate.toISOString(),
						date_fin_resa : localEndDate.toISOString()
					}
				)
				cpt+=2;
			}
		});
		
		return resaArr;
	}

	//Cette fonction envoi les données de réservation à l'API
	const submitResevation = async () => {
		const reservRes = await reserve(props.user, reservations, props.checkedSpace);
		setReservStatus(reservRes);
	}

	return (
		<Dialog
			open={props.showRecap}
			onClose={() => props.setShowRecap(false)}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			fullWidth={true}
			maxWidth={"sm"}
		>
		<DialogTitle id="alert-dialog-title">
			Récapitulatif
		</DialogTitle>
		<DialogContent>
			<List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
				{
					(reservations.length > 0) && reservations.map((resaDate, i)=>{
						const dateStartValue = new Date(resaDate.date_debut_resa);
						const dateEndValue = new Date(resaDate.date_fin_resa);
						const localDateValue = formatInTimeZone(dateStartValue, 'Indian/Reunion', 'dd/MM/yyyy');
						const startHour = zonedTimeToUtc(dateStartValue, 'Indian/Reunion').getHours();
						const endHour = zonedTimeToUtc(dateEndValue, 'Indian/Reunion').getHours();

						return(
							<ListItem key={`resa-${i}`}>
								<ListItemText 
									primary={`Le ${localDateValue}`} 
									secondary={`${startHour}h - ${endHour}h`}
								/>
							</ListItem>
						)
					})
				}
			</List>
		</DialogContent>
		<DialogActions>
			<Button onClick={() => props.setShowRecap(false)}>
				Annuler
			</Button>
			<Button variant="contained" onClick={submitResevation}>
				Reserver
			</Button>
		</DialogActions>
		</Dialog>

	);
}

export default Reservation;