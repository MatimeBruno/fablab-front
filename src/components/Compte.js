import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import {logout, updatePassword, userData} from '../actions/user';
import '../style/compte.css';

const Compte = (props) => {
	const [userInfo, setUserInfo] = useState(null);
	const [newPassword, setNewPassword] = useState("");
	const [oldPassword, setOldPassword] = useState("");
	const [passwordIsUpdated, setPasswordIsUpdated] = useState(null);

	const handleDisconnect = () => {
		logout();
		props.setUser(null);
	}

	const getInfo = async () => {
		const getUserData = await userData(props.user);
		setUserInfo(getUserData);
	}

	const handleChangePassword = async () => {
		const updatedPassword = await updatePassword(props.user, oldPassword, newPassword);
		console.log(updatedPassword);
		setPasswordIsUpdated(updatedPassword);
	}

	useEffect(()=>{
		(userInfo === null) && getInfo();
	})

	return(
		<Box sx={{ width: '100%', padding:"10% 0%" }}>

			<h3>Mes informations</h3>
			<Card sx={{ minWidth: 275, borderBlockColor: 'gray', mb: 6}}>
				<CardContent>
					<Typography sx={{ mb: 1.5 }} color="text.secondary">
						Nom : {userInfo && userInfo.nom}
					</Typography>
					<Typography sx={{ mb: 1.5 }} color="text.secondary">
						Prénom : {userInfo && userInfo.prenom}
					</Typography>
					<Typography sx={{ mb: 1.5 }} color="text.secondary">
						Adresse Email : {userInfo && userInfo.email}
					</Typography>
					<Typography color="text.secondary">
						Classe : {userInfo && userInfo.id_classe}
					</Typography>
				</CardContent>
			</Card>

			<h3>Changez de mot de passe</h3>
			<Card sx={{ minWidth: 275, borderBlockColor: 'gray', mb: 6, '& .MuiTextField-root': { m: 1, width: '25ch'}, }}>
				<CardContent>
					<TextField
						onChange={(e)=>setOldPassword(e.target.value)} 
						value={oldPassword} 
						id="outlined-basic" 
						label="Ancien mot de passe" 
						variant="outlined"
					 />
					<TextField 
						onChange={(e)=>setNewPassword(e.target.value)} 
						value={newPassword} 
						id="outlined-basic" 
						label="Nouveau mot de passe" 
						variant="outlined"
					 />
					<Button id="btnValiderMDP" variant="contained" onClick={handleChangePassword}>VALIDER</Button>
				</CardContent>
				{
					(passwordIsUpdated !== null) && 
						<Alert 
							severity={passwordIsUpdated ? "success" : "error"}
							sx={{m:5}}
						>
							{passwordIsUpdated ? "Mot de passe changé avec succès" : "Le mot de passe n'a pas pu être changé"}
						</Alert>
				}
			</Card>
			<Button variant="contained" onClick={handleDisconnect}>SE DECONNECTER</Button>
		</Box>
	)
}

export default Compte;