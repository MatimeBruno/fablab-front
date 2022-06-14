import {useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import '../style/compte.css';

// Temporary for visual desmontration --------------------------


const Compte = (props) => {
	const [sortBy, setSortBy] = useState("DESC");

	const handleSortChange = (e) => {
		setSortBy(e.target.value);
	}

	return(
		<Box sx={{ width: '100%', padding:"10% 0%" }}>

			<h3>Mes informations</h3>
			<Card sx={{ minWidth: 275, borderBlockColor: 'gray', mb: 6}}>
				<CardContent>
					<Typography sx={{ mb: 1.5 }} color="text.secondary">
					Nom :
					</Typography>
					<Typography sx={{ mb: 1.5 }} color="text.secondary">
					Prénom :
					</Typography>
					<Typography sx={{ mb: 1.5 }} color="text.secondary">
					Adresse Email :
					</Typography>
					<Typography color="text.secondary">
					Classe :
					</Typography>
				</CardContent>
			</Card>

			<h3>Changez de mot de passe</h3>
			<Card sx={{ minWidth: 275, borderBlockColor: 'gray', mb: 6, '& .MuiTextField-root': { m: 1, width: '25ch'}, }}>
				<CardContent>
					<TextField id="outlined-basic" label="Ancien mot de passe" variant="outlined" />
					<TextField id="outlined-basic" label="Nouveau mot de passe" variant="outlined" />
					<Button id="btnValiderMDP" variant="contained">VALIDER</Button>
				</CardContent>
			</Card>
			<Button variant="contained">SE DECONNECTER</Button>
		</Box>
	)
}

export default Compte;