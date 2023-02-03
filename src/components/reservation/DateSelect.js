//React import
import React, { useEffect } from 'react';
//React-date import with date-fns
import { DateRange } from 'react-date-range';
import { isWeekend } from 'date-fns';
import * as locales from 'react-date-range/dist/locale';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
//Material ui import
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';

const DateSelect = (props) => {
	
	useEffect(()=>{
		//Sélectione automatiquement un jour ouvré par défaut
		(props.dates.length === 0) && props.setDates([props.rangeDate[0].startDate])
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
				const myUtcDate = new Date(date.getTime()) 
				myUtcDate.setUTCDate(myUtcDate.getDate());
				dates.push(myUtcDate.toISOString());
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
	const handleDateChange = async(selection) => {
		const dateInRanges = getDatesInRange(
			selection[0].startDate,
			selection[0].endDate
		);
		if (dateInRanges.length <= 31)
		{
			props.setRangeDate(selection);
			props.setDates(dateInRanges);
		}
		else
		{
			props.setError(true);
			props.setRangeDate([
				{
				  startDate: props.valideDate(selection[0].startDate),
				  endDate: props.valideDate(selection[0].endDate),
				  key: 'selection'
				}
			]);
		}
		props.setIsHoursChecked(false);
	}

	return (
		<div>
			<div>
				<Grid container spacing={2} style={{justifyContent:"center"}}>
					<Grid item xs={3} md={3} style={{paddingLeft:0}}>
						Date de début
					</Grid>
					<Grid item xs={3} md={3} style={{paddingLeft:"48px"}}>
						Date de fin
					</Grid>
				</Grid>
				<DateRange
					onChange={item => handleDateChange([item.selection])}
					moveRangeOnFirstSelection={true}
					ranges={props.rangeDate}
					locale={locales['fr']}
					disabledDay={day => isWeekend(day)}
					minDate={props.today}
				/>
			</div>
			<Snackbar
				open={props.error}
				autoHideDuration={6000}
				onClose={()=>props.setError(false)}
				anchorOrigin={{ vertical:"bottom", horizontal:"center" }}
			>
				<MuiAlert onClose={()=>props.setError(false)} severity="error" sx={{ width: '100%' }}>
					Vous ne pouvez pas selectionner plus de 31 jours
				</MuiAlert>
			</Snackbar>
		</div>
	);
}

export default DateSelect;