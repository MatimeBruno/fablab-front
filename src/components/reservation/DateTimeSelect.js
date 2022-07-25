import React, { useState, useEffect } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import { DateRange } from 'react-date-range';
import { isWeekend } from 'date-fns';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import * as locales from 'react-date-range/dist/locale';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
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

const morning_hours = ["8_9","9_10","10_11","11_12"];
const afternoon_hours = ["13_14","14_15","15_16","16_17","17_18"];

const DateTimeSelect = (props) => {
	const indeterminateMorningBool = props.checkedMorningHourly.length > 0 && morning_hours.length !== props.checkedMorningHourly.length;
	const indeterminateAfternoonBool = props.checkedAfternoonHourly.length > 0 && afternoon_hours.length !== props.checkedAfternoonHourly.length;
	const [isDateConfirmed, setIsDateConfirmed] = useState(false);
	const [error, setError] = useState(false);
	const today = new Date();
	today.setDate(today.getDate() + 1); // set tomorrow day as min date

	useEffect(()=>{
		props.setIsStepIsInvalid(
			props.checkedMorningHourly.length === 0 && props.checkedAfternoonHourly.length === 0
		)
	})
	
	const valideDate = (date) => {
		while (isWeekend(date))
		{
			date.setDate(date.getDate() + 1)
		}
		return date
	}

	const [rangeDate, setRangeDate] = useState([
		{
			startDate: valideDate(today),
			endDate: valideDate(today),
			key: 'selection'
		}
	]);

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

	const handleDateChange = (selection) => {
		const dateInRanges = getDatesInRange(
			selection[0].startDate,
			selection[0].endDate
		);
		if (dateInRanges.length <= 31)
		{
			setRangeDate(selection);
		}
		else
		{
			setError(true);
			setRangeDate([
				{
				  startDate: valideDate(today),
				  endDate: valideDate(today),
				  key: 'selection'
				}
			]);
		}
	}
	
	const weekends = day => {
        return isWeekend(day);
    };
	
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

		props.setIsStepIsInvalid(
			props.checkedMorningHourly.length === 0 && props.checkedAfternoonHourly.length === 0
		)
	}

	const handleParentChange = (e, period) => {
		if(period === "morning")
		{
			(e.target.checked)?
				//insert the hour in checked array
				props.setCheckedMorningHourly(morning_hours)
				:
				//remove the hour from checked array
				props.setCheckedMorningHourly([]); 
		}

		if (period === "afternoon")
		{
			(e.target.checked)?
				//insert the hour in checked array
				props.setCheckedAfternoonHourly(afternoon_hours)
				:
				//remove the hour from checked array
				props.setCheckedAfternoonHourly([]);
		}

		if(period === "daytime")
		{
			if(e.target.checked)
			{
				//insert the hour in checked array
				props.setCheckedMorningHourly(morning_hours)
				props.setCheckedAfternoonHourly(afternoon_hours)
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

	const nextStep = () => {
		if(props.checkedMorningHourly.length > 0 || props.checkedAfternoonHourly.length > 0)
		{
			props.setDates(rangeDate[0])
			props.handleNext();
		}
	}

	return (
		<div>
			<div>
				<DateRange
					onChange={item => handleDateChange([item.selection])}
					moveRangeOnFirstSelection={false}
					ranges={rangeDate}
					locale={locales['fr']}
					disabledDay={day => weekends(day)}
					minDate={today}
				/>
			</div>
			<div style={{textAlign:'center'}}>
				<Button autoFocus onClick={()=>setIsDateConfirmed(true)}>
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
												morning_hours.length === props.checkedMorningHourly.length 
												&&
												afternoon_hours.length === props.checkedAfternoonHourly.length
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
													checked={morning_hours.length === props.checkedMorningHourly.length}
													indeterminate={indeterminateMorningBool}
													onChange={(e)=>handleParentChange(e, "morning")}
												/>
											}
										/>
										<Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
											{
												morning_hours.map((hour)=>{
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
													checked={afternoon_hours.length === props.checkedAfternoonHourly.length}
													indeterminate={indeterminateAfternoonBool}
													onChange={(e)=>handleParentChange(e, "afternoon")}
												/>
											}
										/>
										<Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
											{
												afternoon_hours.map((hour)=>{
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