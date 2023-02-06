import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
// Material ui details reservation
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// MaterialUI import
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
// Material icon import
import DateRangeIcon from '@mui/icons-material/DateRange';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
// QR code
import { QRCodeSVG } from 'qrcode.react';
// My import
import { getMyReserv } from '../actions/reservation';
import { zonedTimeToUtc, formatInTimeZone } from 'date-fns-tz'
import CalendarEvents from './reservation/CalendarEvents';

const MyReservation = (props) => {
	const [sortBy, setSortBy] = useState("o1");
	const [userReservs, setUserSetReserv] = useState([]);
	const [openDetails, setOpenDetails] = useState(false);
	const [details, setDetails] = useState(null);
	const [expandedPin, setExpandedPin] = useState(false);
	const [expandedQrCode, setExpandedQrCode] = useState(false);
	const [view, setView] = React.useState('list');
	/**
	 * Affiche ou cache le code pin/QR code 
	 * @param {String} expandType 
	 */
	const handleExpandClick = (expandType) => {
		if (expandType === "pin") {
			setExpandedPin(!expandedPin);
			setExpandedQrCode(false);
		}

		if (expandType === "qrCode") {
			setExpandedQrCode(!expandedQrCode);
			setExpandedPin(false);
		}
	}

	/**
	 * Affiche les détails de la réservation
	 * @param {Number} id 
	 */
	const handleClickOpen = (id) => {
		setOpenDetails(true);
		setDetails(id);
	};

	//Permet la fermeture du modal qui affiche les détails d'une réservation
	const handleClose = () => {
		setOpenDetails(false);
		setDetails(null);
	};

	//Récupérer la liste de réservation d'un utilisateur
	const getUserReservs = async () => {
		const reservList = await getMyReserv(props.user, sortBy);
		(reservList.length > 0) ? setUserSetReserv(reservList) : setUserSetReserv(false);
	}

	useEffect(() => {
		(userReservs.length === 0) && getUserReservs();
	}, [userReservs])

	/**
	 * Gère la selection du tri (Date (réservations récentes) | Date (réservations anciennes))
	 * @param {object} e
	 */
	const handleSortChange = (e) => {
		setSortBy(e.target.value);
		setUserSetReserv([]);
	}

	const handleChangeView = (event, nextView) => {
		if (nextView !== null)
		{
			setView(nextView);
		}
	};

	return(
		<Box sx={{ flexGrow: 1 }}>
			<br></br>
			<br></br>
			<Grid container>
				<Grid item xs={8} md={8}>
					<h1 className='text-center'>Vos réservations</h1>
				</Grid>
				<Grid item xs={7} md={2}>
					{
						(view === 'list') &&
							<FormControl fullWidth>
								<InputLabel id="sort-label">Trier par</InputLabel>
								<Select
									labelId="sort-label"
									id="sort-select"
									value={sortBy}
									label="Trier par"
									onChange={handleSortChange}
								>
									<MenuItem value="o1">Date (réservations récentes)</MenuItem>
									<MenuItem value="o2">Date (réservations anciennes)</MenuItem>
								</Select>
							</FormControl>
					}
				</Grid >
				<Grid item xs={2} md={2} style={{textAlign:"end",paddingLeft:10}}>
					<ToggleButtonGroup
						orientation="horizontal"
						value={view}
						exclusive
						onChange={handleChangeView}
					>
						<ToggleButton value="list" aria-label="list">
							<ViewAgendaIcon/>
						</ToggleButton>
						<ToggleButton value="calendar" aria-label="calendar">
							<DateRangeIcon/>
						</ToggleButton>
					</ToggleButtonGroup>
				</Grid>
			</Grid>
			{
				!userReservs ? 
					<Alert severity="info">
						<AlertTitle>Info</AlertTitle>
						Vous n'avez aucune réservations — <strong><Link to="/">Cliquez ici pour réserver</Link></strong>
					</Alert>
					:
					<CalendarEvents
						userReservs={userReservs}
						view={view}
						handleClickOpen={handleClickOpen}
					/>
			}
			{
				openDetails && (
					<Dialog
						open={openDetails}
						aria-labelledby="customized-dialog-title"
						onClose={handleClose}
					>
						<DialogTitle id="customized-dialog-title" onClose={handleClose}>
							Réservation
							<IconButton
								aria-label="close"
								onClick={handleClose}
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
							<Card sx={{ maxWidth: 345 }}>
								<CardHeader
									title="Utilisable à partir du"
									subheader={
										`${
											formatInTimeZone(details.start, 'Indian/Reunion', 'dd/MM/yyyy')
										} à 
										${
											zonedTimeToUtc(details.start, 'Indian/Reunion').getHours()
										}h`
									}
								/>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										Espaces concernés : {details.title}
									</Typography>
									<br></br>
									<Typography variant="body2" color="secondary">
										Attention : votre code pin et votre code QR est strcitement personnel ne le montrer à personne
									</Typography>
								</CardContent>
								<CardActions disableSpacing>
									<Button
										onClick={() => handleExpandClick("qrCode")}
									>
										{expandedQrCode ? "Cacher" : "Montrer"} le QR-code
									</Button>
									<Button
										onClick={() => handleExpandClick("pin")}
									>
										{expandedPin ? "Cacher" : "Montrer"} le code pin
									</Button>
								</CardActions>
								<Collapse in={expandedPin} timeout="auto" unmountOnExit>
									<CardContent>
										<Typography variant='h5'>{details.pin}</Typography>
										<Typography>
											Expire le {
												formatInTimeZone(details.end, 'Indian/Reunion', 'dd/MM/yyyy')
											} à {
												zonedTimeToUtc(details.end, 'Indian/Reunion').getHours()
											}h
										</Typography>
									</CardContent>
								</Collapse>
								<Collapse in={expandedQrCode} timeout="auto" unmountOnExit>
									<CardContent>
										<QRCodeSVG value={details.pin} />
										<Typography>
											Expire le {
												formatInTimeZone(details.end, 'Indian/Reunion', 'dd/MM/yyyy')
											} à {
												zonedTimeToUtc(details.end, 'Indian/Reunion').getHours()
											}h
										</Typography>
									</CardContent>
								</Collapse>
							</Card>
						</DialogContent>
					</Dialog>
				)
			}
		</Box>
	)
	
}

export default MyReservation;