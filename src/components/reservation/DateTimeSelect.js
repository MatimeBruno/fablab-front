import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

//const hours = ["Journée entière", "Matin", "Après-midi", "8h00 - 9h00", "10h00 - 11h00", "11h00 - 12h00", "13h00 - 14h00", "14h00 - 15h00", "15h00 - 16h00", "16h00 - 17h00", "17h00 - 18h00"];

const DateTimeSelect = () => {
	//const [dateValue, setDateValue] = useState(new Date());
	const [dateDebut, setDateDebutValue] = useState(null);
	const [dateFin, setDateFinValue] = useState(null);
	const [jourDebut, setJourDebutValue] = useState(null);
	const [jourFin, setJourFinValue] = useState(null);
	/* const [fromTimeValue, setFromTimeValue] = useState(""); */
	/* const [toTimeValue, setToTimeValue] = useState(""); */
	/* const [openDialog, setOpenDialog] = useState(false); */
	// const dateFormat = dateValue.toLocaleDateString('fr-FR', { weekday: "long", year: "numeric", month: "short", day: "numeric" }

	const onDateChange = (newDate) => {
		const listdate = [{date:newDate[0].getDate(), day:newDate[0].getDay()}, {date:newDate[1].getDate(), day:newDate[1].getDay()}];
		// setDateValue(listdate);
		console.log(listdate);
		setDateDebutValue(listdate[0].date);
		setDateFinValue(listdate[1].date);
		setJourDebutValue(listdate[0].day);
		setJourFinValue(listdate[1].day)
	}

	/* const setDate = (date) => {
		setDateValue(date);
	}*/

	/* const setFromTime = (e) => {
		console.log(typeof e.target.value);
		setFromTimeValue(e.target.value)
	} */

	/* const setToTime = (e) => {
		console.log(typeof e.target.value);
		setToTimeValue(e.target.value)
	} */

	/* const handleClose = () => {
		setOpenDialog(false);
	}; */

	/* if (openDialog)
	{
		return (
			<Dialog
				fullWidth={true}
				open={openDialog}
				onClose={handleClose}
				maxWidth="lg"
				scroll="paper"
			>
				<DialogTitle sx={{ textAlign: "center" }}>
					{dateValue[0]}
				</DialogTitle>
				<DialogContent>
					<Box sx={{ display: 'flex', justifyContent: "center" }}>
						<Box sx={{ display: 'flex', alignItems: 'baseline' }}>
						<FormGroup>
							{hours.map((value, index) => {
								return <FormControlLabel control={<Checkbox />} label={value} />
							})}
						</FormGroup>
						</Box>
					</Box>
				</DialogContent>

				<DialogActions>
					<Button onClick={handleClose}>Annuler</Button>
					<Button onClick={handleClose}>Réserver</Button>
				</DialogActions>
			</Dialog>
		)
	}
	else
	{ */
		return (
			<div>
				<Calendar onChange={onDateChange} value={0} locale="fr" minDate={new Date} selectRange={true} tileDisabled={({ date, view }) =>
          (view === "month" && date.getDay() === 0) || date.getDay() === 6
        }/>
				<p className='text-center'>
					<span className='bold'>Start:</span>{dateDebut && dateDebut}
					&nbsp;|&nbsp;
					<span className='bold'>End:</span>{dateFin && dateFin}
				</p>
			</div>
		);
	// }
}

export default DateTimeSelect;