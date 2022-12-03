//React import
import React, { useState, useEffect } from 'react';
//React-date import with date-fns
import { DateRange } from 'react-date-range';
import { isWeekend } from 'date-fns';
import * as locales from 'react-date-range/dist/locale';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
//Material ui import
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import {checkHours} from '../../actions/reservation';

// const morning_hours = ["8_9","9_10","10_11","11_12"];
// const afternoon_hours = ["13_14","14_15","15_16","16_17","17_18"];

const DateTimeSelect = (props) => {
	const [hours, setHours] = useState({
		morning_hours:[],
		afternoon_hours:[]
	});
	const indeterminateMorningBool = props.checkedMorningHourly.length > 0 && hours.morning_hours.length !== props.checkedMorningHourly.length;
	const indeterminateAfternoonBool = props.checkedAfternoonHourly.length > 0 && hours.afternoon_hours.length !== props.checkedAfternoonHourly.length;
	const [isDateConfirmed, setIsDateConfirmed] = useState(false);
	const [error, setError] = useState(false);
	const today = new Date();
	today.setDate(today.getDate() + 1); //La date minimum et selectionnée par défaut est la date du lendemain
	/**
	 * Cette fonction vérifie si la date n'est ni un samedi ni un dimanche, si c'est le cas la fonction 
	 * passe au jour suivant pour au final retourné un jour ouvré 
	 * @param {Date} date
	 * @returns {Date} une date correspondant à un jour ouvré
	 */
	const valideDate = (date) => {
		while (isWeekend(date))
		{
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
	
	useEffect(()=>{
		//Sélectione automatiquement un jour ouvré par défaut
		(props.dates.length === 0) && props.setDates([rangeDate[0].startDate])
		
		//Si vrai, impossible de passer à l'étape suivante
		props.setIsStepIsInvalid(
			props.checkedMorningHourly.length === 0 && props.checkedAfternoonHourly.length === 0
		)
	})
	
	/**
	 * Cette fonction récupère les dates et retire les week-ends de la selection
	 * @param {Date} startDate - La date de début
	 * @param {Date} endDate - La date de fin
	 * @returns {Array} un array contenant les dates
	 */
	const getDatesInRange = (startDate, endDate) => {
		const date = new Date(startDate.getTime());
		
		const dates = [];
		
		while (date <= endDate)
		{
			if (!isWeekend(date))
			{
				dates.push(new Date(date));
			}
			date.setDate(date.getDate() + 1);
		}
		
		return dates;
	}

	/**
	 * La selection de date est géré par cette fonction, elle enregistre la/les date(s) uniquement
	   si le nombre de jour séléctionner est inférieur à 31 (week-end non inclus)
	 * @param {Array} date
	 */
	const handleDateChange = (selection) => {
		const dateInRanges = getDatesInRange(
			selection[0].startDate,
			selection[0].endDate
		);
		if (dateInRanges.length <= 31)
		{
			setRangeDate(selection);
			props.setDates(dateInRanges)
		}
		else
		{
			setError(true);
			setRangeDate([
				{
				  startDate: valideDate(selection[0].startDate),
				  endDate: valideDate(selection[0].endDate),
				  key: 'selection'
				}
			]);
		}
	}
	
	/**
	 * Les horaires séléctionner sont gérer par cette fonction
	 * @param {Object} e 
	 * @param {String} period 
	 */
	const onHoursSelection = (e, period) => {
		if(period === "morning")
		{
			(e.target.checked)?
				//insert the hour in checked array
				props.setCheckedMorningHourly(morningHourlyList => [...morningHourlyList, e.target.value])
				:
				//remove the hour from checked array
				props.setCheckedMorningHourly(
					(morningHourlyList) => morningHourlyList.filter(
						(morningHourlyValue) => morningHourlyValue !== e.target.value
					)
				); 
		}

		if (period === "afternoon")
		{
			(e.target.checked)?
				//insert the hour in checked array
				props.setCheckedAfternoonHourly(afternoonHourlyList => [...afternoonHourlyList, e.target.value])
				:
				//remove the hour from checked array
				props.setCheckedAfternoonHourly(
					(afternoonHourlyList) => afternoonHourlyList.filter(
						(afternoonHourlyValue) => afternoonHourlyValue !== e.target.value
					)
				); 
		}

		//Si vrai, impossible de passer à l'étape suivante
		props.setIsStepIsInvalid(
			props.checkedMorningHourly.length === 0 && props.checkedAfternoonHourly.length === 0
		)
	}

	/**
	 * Cette fonction permet de gérer un ensemble de selection ou déselection d'horaire
	 * par exemple, il est possible gâce à cette fonction de séléctioner d'un clique toutes les heures matinaux 
	 * @param {Object} e 
	 * @param {String} period 
	 */
	const handleParentChange = (e, period) => {
		if(period === "morning")
		{
			(e.target.checked)?
				//insert the hour in checked array
				props.setCheckedMorningHourly(hours.morning_hours)
				:
				//remove the hour from checked array
				props.setCheckedMorningHourly([]); 
		}

		if (period === "afternoon")
		{
			(e.target.checked)?
				//insert the hour in checked array
				props.setCheckedAfternoonHourly(hours.afternoon_hours)
				:
				//remove the hour from checked array
				props.setCheckedAfternoonHourly([]);
		}

		if(period === "daytime")
		{
			if(e.target.checked)
			{
				//insert the hour in checked array
				props.setCheckedMorningHourly(hours.morning_hours)
				props.setCheckedAfternoonHourly(hours.afternoon_hours)
			}
			else
			{
				//remove the hour from checked array
				props.setCheckedAfternoonHourly([]);
				props.setCheckedMorningHourly([]);
			}
		}

		props.setIsStepIsInvalid(
			props.checkedMorningHourly.length === 0 && props.checkedAfternoonHourly.length === 0
		)
	}

	const confirmDate = async () => {
		//Check les heures disponibles
		const dates = [];
		props.dates.forEach(date => {
			date.setUTCDate(date.getDate());
			dates.push(date)
		});
		const checkHoursRes = await checkHours(dates, props.checkedSpace);
		setHours(checkHoursRes);
		setIsDateConfirmed(true);
	}

	//Cette fontion permet de passer à l'étape suivante une fois les heures 
	const nextStep = () => {
		if(props.checkedMorningHourly.length > 0 || props.checkedAfternoonHourly.length > 0)
		{
			props.handleNext();
		}
	}

	return (
		<div>
			<div>
				<DateRange
					onChange={item => handleDateChange([item.selection])}
					moveRangeOnFirstSelection={true}
					ranges={rangeDate}
					locale={locales['fr']}
					disabledDay={day => isWeekend(day)}
					minDate={today}
				/>
			</div>
			<div style={{textAlign:'center'}}>
				<Button autoFocus onClick={confirmDate}>
					Séléctionnez l'heure
				</Button>
			</div>

			{
					<Dialog
						onClose={()=>setIsDateConfirmed(false)}
						aria-labelledby="customized-dialog-title"
						open={isDateConfirmed}
					>
						<DialogTitle id="customized-dialog-title" onClose={()=>setIsDateConfirmed(false)}>
							Choix horaire
							<IconButton
								aria-label="close"
								onClick={()=>setIsDateConfirmed(false)}
								sx={{
									position: 'absolute',
									right: 8,
									top: 8,
									color: (theme) => theme.palette.grey[500],
								}}
							>
								<CloseIcon />
							</IconButton>
						</DialogTitle>
						<DialogContent dividers>
							<FormControl 
								sx={{ m: 3 }}
								component="fieldset" 
								variant="standard" 
								error={
									props.checkedMorningHourly.length === 0 && props.checkedAfternoonHourly.length === 0
								} 
							>
								<FormControlLabel
									label="Toute la journée"
									control={
										<Checkbox
											checked={
												hours.morning_hours.length === props.checkedMorningHourly.length 
												&&
												hours.afternoon_hours.length === props.checkedAfternoonHourly.length
											}
											onChange={(e)=>handleParentChange(e, "daytime")}
										/>
									}
								/>
								<Box sx={{ display: 'flex', ml: 3 }}>
									<FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
										<FormControlLabel
											label="Toute la matinée"
											control={
												<Checkbox
													checked={hours.morning_hours.length === props.checkedMorningHourly.length}
													indeterminate={indeterminateMorningBool}
													onChange={(e)=>handleParentChange(e, "morning")}
												/>
											}
										/>
										<Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
											{
												hours.morning_hours.map((hour)=>{
													const splitedHour = hour.split('_');
													return(
														<FormControlLabel
															key={hour}
															label={`${splitedHour[0]}h00 - ${splitedHour[1]}h00`}
															control={
																<Checkbox
																	checked={props.checkedMorningHourly.includes(hour)} 
																	onChange={(e)=>onHoursSelection(e,"morning")}
																	value={hour}
																/>
															}
														/>
													)
												})
											}
										</Box>
									</FormControl>
									<FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
										<FormControlLabel
											label="Toute l'après-midi"
											control={
												<Checkbox
													checked={hours.afternoon_hours.length === props.checkedAfternoonHourly.length}
													indeterminate={indeterminateAfternoonBool}
													onChange={(e)=>handleParentChange(e, "afternoon")}
												/>
											}
										/>
										<Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
											{
												hours.afternoon_hours.map((hour)=>{
													const splitedHour = hour.split('_');
													return(
														<FormControlLabel
															key={hour}
															label={`${splitedHour[0]}h00 - ${splitedHour[1]}h00`}
															control={
																<Checkbox
																	checked={props.checkedAfternoonHourly.includes(hour)} 
																	onChange={(e)=>onHoursSelection(e,"afternoon")}
																	value={hour}
																/>
															}
														/>
													)
												})
											}
										</Box>
									</FormControl>
								</Box>
								<FormHelperText>Choisissez au moins une tranche horaire</FormHelperText>
							</FormControl>
						</DialogContent>
						<DialogActions>
							<Button autoFocus onClick={nextStep}>
								Suivant
							</Button>
						</DialogActions>
					</Dialog>
			}
			<Snackbar
				open={error}
				autoHideDuration={6000}
				onClose={()=>setError(false)}
				anchorOrigin={{ vertical:"bottom", horizontal:"center" }}
			>
				<MuiAlert onClose={()=>setError(false)} severity="error" sx={{ width: '100%' }}>
					Vous ne pouvez pas selectionner plus de 31 jours
				</MuiAlert>
			</Snackbar>
		</div>
	);
}

export default DateTimeSelect;