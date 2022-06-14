import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const DateTimeSelect = () => {
	const [dateValue, setDateValue] = useState(new Date());
	const [fromTimeValue, setFromTimeValue] = useState("");
	const [toTimeValue, setToTimeValue] = useState("");
	const [openDialog, setOpenDialog] = useState(false);
	const dateFormat = dateValue.toLocaleDateString('fr-FR', { weekday: "long", year: "numeric", month: "short", day: "numeric" })

	const setDate = (date) => {
		setDateValue(date);
		setOpenDialog(true);
	}

	const setFromTime = (e) => {
		console.log(typeof e.target.value);
		setFromTimeValue(e.target.value)
	}

	const setToTime = (e) => {
		console.log(typeof e.target.value);
		setToTimeValue(e.target.value)
	}

	const handleClose = () => {
		setOpenDialog(false);
	};

	if (openDialog)
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
					{dateFormat}
				</DialogTitle>
				<DialogContent>
					<Box sx={{ display: 'flex', justifyContent: "center" }}>
						<Box sx={{ display: 'flex', alignItems: 'baseline' }}>
							<span>De :</span>
							<TextField
								autoFocus
								margin="dense"
								onChange={setFromTime}
								id="hour-from"
								type="time"
								variant="standard"
								sx={{ ml: 2 }}
							/>
						</Box>
						<Box sx={{ display: 'flex', alignItems: 'baseline', ml: 3 }}>
							<span>À :</span>
							<TextField
								autoFocus
								margin="dense"
								onChange={setToTime}
								id="hour-to"
								type="time"
								variant="standard"
								sx={{ ml: 2 }}
							/>
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
	{
		return (
			<div>
				<Calendar onChange={setDate} value={dateValue} locale="fr" />
			</div>
		);
	}
}

export default DateTimeSelect;