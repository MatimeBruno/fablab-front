// React import
import React, { useState } from 'react';
//React-date import with date-fns
import { isWeekend } from 'date-fns';
// Material ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// My import
import ChooseSpace from './reservation/ChooseSpace';
import DateSelect from './reservation/DateSelect';
import TimeSelect from './reservation/TimeSelect';
import Reservation from './reservation/Reservation';
import Item from './componentMIH/Item';

const Home = (props) => {
	const commonHomeStyle = {height:"100%"}
	//Space states
	const [checkedSpace, setCheckedSpace] = useState([]);
	// Date and time states;
	const [dates, setDates] = useState([]);
	const [checkedMorningHourly, setCheckedMorningHourly] = useState([]);
	const [checkedAfternoonHourly, setCheckedAfternoonHourly] = useState([]);
	const [isHoursChecked, setIsHoursChecked] = useState(true);
	const today = new Date();
	today.setDate(today.getDate() + 1); //La date minimum et selectionnée par défaut est la date du lendemain
	/**
	 * Cette fonction vérifie si la date n'est ni un samedi ni un dimanche, si c'est le cas la fonction 
	 * passe au jour suivant pour au final retourné un jour ouvré 
	 * @param {Date} date
	 * @returns {Date} une date correspondant à un jour ouvré
	*/
	const valideDate = (date) => {
		while (isWeekend(date)) {
			date.setDate(date.getDate() + 1)
		}
		return date
	}
	//Initialise la selection du calendrier
	const [rangeDate, setRangeDate] = useState([
		{
			startDate: valideDate(today),
			endDate: valideDate(today),
			key: 'selection'
		}
	]);
	//----
	const [error, setError] = useState(false);
	const [showRecap, setShowRecap] = useState(false);

	const handleRecapDisplay = () => {
		if (
			dates.length > 0 &&
			(checkedMorningHourly.length > 0 ||
			checkedAfternoonHourly.length > 0) &&
			checkedSpace.length > 0
		)
		{
			setShowRecap(true);
		}
		else
		{
			setShowRecap(false);
			setError(true);
		}
	}

	return (
		<Box sx={{ flexGrow: 1 }}>
			<br></br>
			<br></br>
			<Grid container>
				<Grid item xs={8} md={8}>
					<h1 className='text-center'>Réservation</h1>
				</Grid>
				<Grid item xs={4} md={4} style={{textAlign:"end"}}>
					<Button variant="contained" onClick={handleRecapDisplay}>
						Réserver
					</Button>
				</Grid>
			</Grid>
			<Grid container spacing={2}>
				<Grid item xs={12} md={4}>
					<Item style={commonHomeStyle}>
						<h3>Espaces à choisir</h3>
						<ChooseSpace
							checkedSpace={checkedSpace}
							setCheckedSpace={setCheckedSpace}
							setIsHoursChecked={setIsHoursChecked}
						/>
					</Item>
				</Grid>
				<Grid item xs={12} md={4}>
					<Item style={commonHomeStyle}>
						<h3>Date à selectionner</h3>
						<DateSelect
							setDates={setDates}
							dates={dates}
							checkedSpace={checkedSpace}
							error={error}
							setError={setError}
							rangeDate={rangeDate}
							setRangeDate={setRangeDate}
							today={today}
							setIsHoursChecked={setIsHoursChecked}
						/>
					</Item>
				</Grid>
				<Grid item xs={12} md={4}>
					<Item style={commonHomeStyle}>
						<h3>Créneaux horaires disponibles</h3>
						<TimeSelect
							dates={dates}
							checkedSpace={checkedSpace}
							checkedMorningHourly={checkedMorningHourly}
							setCheckedMorningHourly={setCheckedMorningHourly}
							checkedAfternoonHourly={checkedAfternoonHourly}
							setCheckedAfternoonHourly={setCheckedAfternoonHourly}
							setIsHoursChecked={setIsHoursChecked}
							isHoursChecked={isHoursChecked}
						/>
					</Item>
				</Grid>
			</Grid>
			<Reservation
				user={props.user}
				dates={dates}
				checkedMorningHourly={checkedMorningHourly}
				checkedAfternoonHourly={checkedAfternoonHourly}
				checkedSpace={checkedSpace}
				showRecap={showRecap}
				setShowRecap={setShowRecap}
				setIsHoursChecked={setIsHoursChecked}
				setCheckedSpace={setCheckedSpace}
				setDates={setDates}
				setCheckedMorningHourly={setCheckedMorningHourly}
				setCheckedAfternoonHourly={setCheckedAfternoonHourly}
				setRangeDate={setRangeDate}
				initialDate={[
					{
						startDate: valideDate(today),
						endDate: valideDate(today),
						key: 'selection'
					}
				]}
			/>
			<Snackbar
				open={error}
				autoHideDuration={6000}
				onClose={()=>setError(false)}
				anchorOrigin={{ vertical:"bottom", horizontal:"center" }}
			>
				<MuiAlert onClose={()=>setError(false)} severity="error" sx={{ width: '100%' }}>
					Veuillez séléctionner l'espace, la date et l'heure
				</MuiAlert>
			</Snackbar>
		</Box>
	)
}

export default Home;