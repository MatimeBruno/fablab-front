import React, { useState } from 'react';
// Date time thingd
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { zonedTimeToUtc, formatInTimeZone } from 'date-fns-tz'
// Material UI things
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const localizer = momentLocalizer(moment)

const CalendarEvents = (props) => {
	const [selected, setSelected] = useState();
	const reachedPin = [];
	const spacesByResa = {};
	const reservations = [];

	//Regroup by pin code
	props.userReservs.forEach(reserv => {
		if (!reachedPin.includes(reserv.pin))
		{
			reachedPin.push(reserv.pin);
			spacesByResa[reserv.pin] = [reserv.intitule];
			reservations.push(
				{
					'start': zonedTimeToUtc(reserv.date_debut_resa, 'Indian/Reunion'),
					'end': zonedTimeToUtc(reserv.date_fin_resa, 'Indian/Reunion'),
					'pin': reserv.pin
				}
			);
		}
		else
		{
			spacesByResa[reserv.pin].push(reserv.intitule);
		}
	});

	reservations.forEach(reserv=>{
		reserv['title'] = spacesByResa[reserv.pin].join(", ")
	})


	return(
		<div>
			{
				(props.view === 'list') ?
					<List sx={{ width: '100%', maxWidth: 720, bgcolor: 'background.paper', margin: 'auto' }}>
						{
							reservations.map((reserv)=>(
								<React.Fragment>
									<ListItem 
										alignItems="center"
										secondaryAction={
											<Button variant="text" onClick={()=>props.handleClickOpen(reserv)}>
												Détails
											</Button>
										}
									>
										<ListItemText
											primary={
												`${
													reserv.start.getHours()
												}h - 
												${
													reserv.end.getHours()
												}h`
											}
											secondary={
												<React.Fragment>
												<Typography
													sx={{ display: 'inline' }}
													component="span"
													variant="body2"
													color="text.primary"
												>
													{formatInTimeZone(reserv.start, 'Indian/Reunion', 'dd/MM/yyyy')}
												</Typography>
												{` — ${(spacesByResa[reserv.pin].length > 1) ? "Emplacements multiples" : "Un emplacement"}`}
												</React.Fragment>
											}
										/>
									</ListItem>
									<Divider variant="inset" component="li" />
								</React.Fragment>
							))
						}
					</List>
					:
					(props.view === 'calendar') ?
						<>
							<br></br>
							<br></br>
							<Calendar
								localizer={localizer}
								events={reservations}
								selected={selected}
								startAccessor="start"
								endAccessor="end"
								culture='fr'
								style={{ height: 500 }}
								onSelectEvent={(event)=>props.handleClickOpen(event)}
							/>
						</>
						:
						""
			}
		</div>
	)
}

export default CalendarEvents;