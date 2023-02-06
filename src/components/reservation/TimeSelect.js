//React import
import React, { useState, useEffect } from 'react';
//Material ui import
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
// My imports
import {checkHours} from '../../actions/reservation';
import useIsMobile from '../../hook/screenSize';

const TimeSelect = (props) => {
	let flexDirSetting = 'unset';
	const [hours, setHours] = useState(null);

	const checkingHours = async () => {
		if(props.dates.length > 0 && props.checkedSpace.length > 0)
		{
			const checkHoursRes = await checkHours(props.dates, props.checkedSpace);
			setHours(checkHoursRes);
		}
		else
		{
			setHours(null);
		}
	}

	useEffect(()=>{
		if(!props.isHoursChecked || hours === null)
		{
			checkingHours();
			props.setIsHoursChecked(true);
		}
	})
	
	/**
	 * Les horaires séléctionner sont gérer par cette fonction
	 * @param {Object} e 
	 * @param {String} period 
	 */
	const onHoursSelection = (e, period) => {
		if (period === "morning") {
			(e.target.checked) ?
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

		if (period === "afternoon") {
			(e.target.checked) ?
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
	}

	/**
	 * Cette fonction permet de gérer un ensemble de selection ou déselection d'horaire
	 * par exemple, il est possible gâce à cette fonction de séléctioner d'un clique toutes les heures matinaux 
	 * @param {Object} e 
	 * @param {String} period 
	 */
	const handleParentChange = (e, period) => {
		if (period === "morning") {
			(e.target.checked) ?
				//insert the hour in checked array
				props.setCheckedMorningHourly(hours.morning_hours)
				:
				//remove the hour from checked array
				props.setCheckedMorningHourly([]);
		}

		if (period === "afternoon") {
			(e.target.checked) ?
				//insert the hour in checked array
				props.setCheckedAfternoonHourly(hours.afternoon_hours)
				:
				//remove the hour from checked array
				props.setCheckedAfternoonHourly([]);
		}

		if (period === "daytime") {
			if (e.target.checked) {
				//insert the hour in checked array
				props.setCheckedMorningHourly(hours.morning_hours)
				props.setCheckedAfternoonHourly(hours.afternoon_hours)
			}
			else {
				//remove the hour from checked array
				props.setCheckedAfternoonHourly([]);
				props.setCheckedMorningHourly([]);
			}
		}

	}

	if(useIsMobile())
	{
		flexDirSetting = 'column';
	}

	if (hours === null)
	{
		return <p>Choisissez vos dates et vos espaces</p>
	}

	if(hours.morning_hours.length === 0 && hours.afternoon_hours.length === 0)
	{
		return <p>Aucun créneaux disponibles</p>
	}

	const indeterminateMorningBool = props.checkedMorningHourly.length > 0 && hours.morning_hours.length !== props.checkedMorningHourly.length;
	const indeterminateAfternoonBool = props.checkedAfternoonHourly.length > 0 && hours.afternoon_hours.length !== props.checkedAfternoonHourly.length;

	return (
		<div>
			<FormControl>
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
				<Box sx={{ display: 'flex', flexDirection: flexDirSetting, ml: 3 }}>
					<FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
						{
							(hours.morning_hours) && 
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
						}
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
						{
							(hours.afternoon_hours.length > 0) && 
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
						}
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
			</FormControl >
		</div>
	);
}

export default TimeSelect;