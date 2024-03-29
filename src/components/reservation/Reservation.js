import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {reserve} from '../../actions/reservation';
import { zonedTimeToUtc, formatInTimeZone } from 'date-fns-tz';

const Reservation = (props) => {
	const [reservations, setReservation] = useState([]);
	const [reservStatus, setReservStatus] = useState(null);
	const [isRecapDone, setIsRecapDone] = useState(false);

	useEffect(()=>{
		if(props.showRecap && !isRecapDone)
		{
			setReservation(getResaData());
			setIsRecapDone(reservations.length > 0);
		}
	})

	const handleClose = () => {
		setIsRecapDone(false);
		props.setShowRecap(false);
	}

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

			start_date_instance.setDate(start_date_instance.getDate()-1);
			end_date_instance.setDate(end_date_instance.getDate()-1);

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

		if (reservRes !== false)
		{
			props.setCheckedSpace([])
			props.setDates([])
			props.setCheckedMorningHourly([])
			props.setCheckedAfternoonHourly([])
		}

		props.setShowRecap(false);
		props.setIsHoursChecked(false);
		props.setRangeDate(props.initialDate);
	}

	return (
		<>
			<Dialog
				open={props.showRecap}
				onClose={handleClose}
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
								const localDateValue = formatInTimeZone(resaDate.date_debut_resa, 'Indian/Reunion', 'dd/MM/yyyy');
								const startHour = zonedTimeToUtc(resaDate.date_debut_resa, 'Indian/Reunion').getHours();
								const endHour = zonedTimeToUtc(resaDate.date_fin_resa, 'Indian/Reunion').getHours();

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
					<Button onClick={handleClose}>
						Annuler
					</Button>
					<Button variant="contained" onClick={submitResevation}>
						Reserver
					</Button>
				</DialogActions>
			</Dialog>
			<Snackbar 
				open={reservStatus !== null} 
				autoHideDuration={6000} 
				onClose={()=>setReservStatus(null)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}>
				<MuiAlert onClose={()=>setReservStatus(null)} severity={(reservStatus !== false) ? "success" : "error"} sx={{ width: '100%' }}>
					{(reservStatus !== false) ? "Réservation effectuée avec succès" : "La réservation n'a pas pu être effectuée"}
				</MuiAlert>
			</Snackbar>
		</>
	);
}

export default Reservation;