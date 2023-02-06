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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// My import
import ChooseSpace from './reservation/ChooseSpace';
import DateSelect from './reservation/DateSelect';
import TimeSelect from './reservation/TimeSelect';
import Reservation from './reservation/Reservation';
import Item from './componentMIH/Item';
import useIsMobile from '../hook/screenSize';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
	  <div
		role="tabpanel"
		hidden={value !== index}
		id={`simple-tabpanel-${index}`}
		aria-labelledby={`simple-tab-${index}`}
		{...other}
	  >
		{value === index && (
		  <Box sx={{ p: 3 }}>
			{children}
		  </Box>
		)}
	  </div>
	);
  }

const Home = (props) => {
	const commonHomeStyle = {height:"100%"}
	const [tabValue, setTabValue] = useState(0);
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

	// Tabs methods
	const handleTabChange = (event, newTab) => {
		setTabValue(newTab);
	};

	const a11yProps = (index) => {
		return {
		  id: `simple-tab-${index}`,
		  'aria-controls': `simple-tabpanel-${index}`,
		};
	}

	//Step components
	const Spaces = (
		<ChooseSpace
			checkedSpace={checkedSpace}
			setCheckedSpace={setCheckedSpace}
			setIsHoursChecked={setIsHoursChecked}
		/>
	)

	const Dates = (
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
	)

	const Times = (
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
	)

	return (
		<Box sx={{ flexGrow: 1 }}>
			<br></br>
			<br></br>
			<Grid container sx={{alignItems:'center'}}>
				<Grid item xs={8} md={8}>
					<h1 className='text-center'>Réservation</h1>
				</Grid>
				<Grid item xs={4} md={4} style={{textAlign:"end"}}>
					<Button variant="contained" onClick={handleRecapDisplay}>
						Réserver
					</Button>
				</Grid>
			</Grid>
			{
				(useIsMobile())?
					<Box sx={{ width: '100%', mt:3}}>
						<Tabs value={tabValue} onChange={handleTabChange} aria-label="Reservation menu" centered>
							<Tab label="Espaces" {...a11yProps(0)} />
							<Tab label="Dates" {...a11yProps(1)} />
							<Tab label="Heures" {...a11yProps(2)} />
						</Tabs>
						<TabPanel value={tabValue} index={0}>
							<Item style={commonHomeStyle}>
								<h3>Espaces à choisir</h3>
								{Spaces}
							</Item>
						</TabPanel>
						<TabPanel value={tabValue} index={1}>
							<Item style={commonHomeStyle}>
								<h3>Espaces à choisir</h3>
								{Dates}
							</Item>
						</TabPanel>
						<TabPanel value={tabValue} index={2}>
							<Item style={commonHomeStyle}>
								<h3>Espaces à choisir</h3>
								{Times}
							</Item>
						</TabPanel>
					</Box>
					:
					<Grid container spacing={2}>
						<Grid item xs={12} md={4}>
							<Item style={commonHomeStyle}>
								<h3>Espaces à choisir</h3>
								{Spaces}
							</Item>
						</Grid>
						<Grid item xs={12} md={4}>
							<Item style={commonHomeStyle}>
								<h3>Date à selectionner</h3>
								{Dates}
							</Item>
						</Grid>
						<Grid item xs={12} md={4}>
							<Item style={commonHomeStyle}>
								<h3>Créneaux horaires disponibles</h3>
								{Times}
							</Item>
						</Grid>
					</Grid>
			}

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