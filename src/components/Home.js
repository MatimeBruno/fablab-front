import {useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

// Temporary for visual desmontration --------------------------
function createData(date, time, reservedSpace)
{
	return { date, time, reservedSpace };
}

const rows = [
	createData('03/09/2022', '2 h', 'Imprimante 3d'),
	createData('06/09/2022', '1 h', 'Montage/Réparation PC'),
	createData('10/11/2022', "30 min", 'Co-working'),
];

const Home = (props) => {
	const [sortBy, setSortBy] = useState("DESC");

	const handleSortChange = (e) => {
		setSortBy(e.target.value);
	}

	return(
		<Box sx={{ width: '100%', padding:"20% 0%" }}>
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
							<MenuItem value="DESC">Date (réservations récentes)</MenuItem>
							<MenuItem value="ASC">Date (réservations anciennes)</MenuItem>
							<MenuItem value="Space">Espace réservé</MenuItem>
						</Select>
					</FormControl>
				</Toolbar>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>
									<strong>Date</strong>
								</TableCell>
								<TableCell>
									<strong>Temps</strong>
								</TableCell>
								<TableCell>
									<strong>Espace réservé</strong>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{
								rows.map((row, i) => (
									<TableRow
										key={i}
									>
										<TableCell component="th" scope="row">
											{row.date}
										</TableCell>
										<TableCell>{row.time}</TableCell>
										<TableCell>{row.reservedSpace}</TableCell>
									</TableRow>
								))
							}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</Box>
	)
}

export default Home;