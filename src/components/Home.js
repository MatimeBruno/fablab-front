// React import
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
// Material ui table import
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// Material ui details reservation
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// QR code
import { QRCodeSVG } from 'qrcode.react';
// Material ui
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import Collapse from '@mui/material/Collapse';
// My import 
import { getMyReserv } from '../actions/reservation';

const Home = (props) => {
	const [sortBy, setSortBy] = useState("o1");
	const [userReservs, setUserSetReserv] = useState([]);
	const [openDetails, setOpenDetails] = useState(false);
	const [details, setDetails] = useState(null);
	const [expandedPin, setExpandedPin] = useState(false);
	const [expandedQrCode, setExpandedQrCode] = useState(false);

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
	})

	/**
	 * Gère la selection du tri (Date (réservations récentes) | Date (réservations anciennes))
	 * @param {object} e 
	 */
	const handleSortChange = (e) => {
		setSortBy(e.target.value);
		setUserSetReserv([]);
	}

	return (
		<Box sx={{ width: '100%', padding: "20% 0%" }}>
			{
				(userReservs.length > 0) ?
					<Paper sx={{ width: '100%', mb: 2 }}>
						<Toolbar
							sx={{
								pl: { sm: 2 },
								pr: { xs: 1, sm: 1 },
								mb: 2
							}}
						>
							<Typography
								sx={{ flex: '1 1 100%' }}
								variant="h6"
								id="tableTitle"
								component="div"
							>
								Mes réservations
							</Typography>
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
						</Toolbar>
						<TableContainer component={Paper}>
							<Table sx={{ minWidth: 650 }} aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell>
											<strong>Date de début</strong>
										</TableCell>
										<TableCell align="center">
											<strong>Créneau horaire</strong>
										</TableCell>
										<TableCell>
											{/* Its empty here but dont worry about that, it's just for the sytle*/}
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{
										userReservs.map((row, i) => {
											const dateStartValue = new Date(row.date_debut_resa);
											const dateEndValue = new Date(row.date_fin_resa);
											const dateStartFormat = dateStartValue.toLocaleDateString('fr-FR', { weekday: "long", year: "numeric", month: "short", day: "numeric" });
											const startHour = dateStartValue.getHours();
											const dateEndFormat = dateEndValue.toLocaleDateString('fr-FR', { weekday: "long", year: "numeric", month: "short", day: "numeric" });
											const endHour = dateEndValue.getHours();
											const detailsData = {
												id: row.id_reservation,
												dateStart: dateStartFormat,
												dateEnd: dateEndFormat,
												startHour: startHour,
												endHour: endHour,
												pin: row.pin
											}

											return (
												<TableRow
													key={i}
												>
													<TableCell component="th" scope="row">
														{dateStartFormat}
													</TableCell>
													<TableCell align="center">
														{`${startHour}h - ${endHour}h`}
													</TableCell>
													<TableCell align="center">
														<Button size="small" onClick={() => handleClickOpen(detailsData)}>
															Voir les détails
														</Button>
													</TableCell>
												</TableRow>
											)
										})
									}
								</TableBody>
							</Table>
						</TableContainer>
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
												subheader={`${details.dateStart} à ${details.startHour}h`}
											/>
											<CardContent>
												<Typography variant="body2" color="text.secondary">
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
														Expire le {details.dateEnd} à {details.endHour}h
													</Typography>
												</CardContent>
											</Collapse>
											<Collapse in={expandedQrCode} timeout="auto" unmountOnExit>
												<CardContent>
													<QRCodeSVG value={details.pin} />
													<Typography>
														Expire le {details.dateEnd} à {details.endHour}h
													</Typography>
												</CardContent>
											</Collapse>
										</Card>
									</DialogContent>
								</Dialog>
							)
						}
					</Paper>
					:
					<Card sx={{ minWidth: 275 }}>
						<CardContent>
							<Typography variant="h5" component="div">
								Vous n'avez aucune réservation
							</Typography>
						</CardContent>
						<CardActions>
							<Link to="/reservation">
								<Button size="small">
									Je réserve maintenant
								</Button>
							</Link>
						</CardActions>
					</Card>}
		</Box>
	)

}

export default Home;