import React, { useState } from 'react';
// Layout import
import Paper from '@mui/material/Paper';
// Form import
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
// Icon import
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
//My import
import {login} from '../actions/user';
import '../style/login.css';

const LoginForm = (props) => {
	const [loginValue, setLoginValue] = useState("");
	const [pwdValue, setPwdValue] = useState("");
	const [showPwd, setShowPwd] = useState(false);
	const [loginErr, setLoginErr] = useState("");
	const [showAlert, setShowAlert] = useState(false);
	// const [rememberUser, setRememberUser] = useState(false);

	const handleChange = (e, input) => {
		(input === "login") && setLoginValue(e.target.value);
		(input === "password") && setPwdValue(e.target.value);
	}

	const handleClickShowPassword = () => {
		setShowPwd(!showPwd);
	}

	// const handleClickRememberUser = () => {
	// 	setRememberUser(!rememberUser)
	// }

	const handleLoginSubmit = (e) => {
		e.preventDefault();
		if (loginValue.length > 0 && pwdValue.length > 0)
		{
			const userLogin = async () => {
				const loginStatus = await login(loginValue, pwdValue);
				if(loginStatus  === null)
				{
					setShowAlert(true);
					setLoginErr("Identifant ou mot de passe incorrect.");	
				}
				else
				{
					props.setUser(loginStatus);
				}
			}

			userLogin();
		}
		else
		{
			setShowAlert(true);
			setLoginErr("Veuillez entrer vos identifiants");
		}
	}

	return(
		<>
			<h1 className='loginTitle'>Bienvenue</h1>
			<Paper elevation={3} sx={{width:"100%", mx:"auto", marginTop:"2%", padding:"2%"}}>
				<h3 className='loginSubTitle'>Identifiez-vous</h3>
				<form onSubmit={handleLoginSubmit} className='loginForm'>
					<TextField 
						id="outlined-basic"
						label="Identifiant"
						variant="outlined"
						value={loginValue}
						onChange={(e)=>handleChange(e, "login")}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<AccountCircle />
								</InputAdornment>
							),
						}}
						sx={{ m: 2 }}
						autoFocus
					/>

					<FormControl sx={{ m: 2 }} variant="outlined">
						<InputLabel htmlFor="outlined-adornment-password">Mot de passe</InputLabel>
						<OutlinedInput
							id="outlined-adornment-password"
							type={showPwd ? 'text' : 'password'}
							value={pwdValue}
							onChange={(e)=>handleChange(e, "password")}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="Voir le mot de passe"
										onClick={handleClickShowPassword}
										edge="end"
									>
										{showPwd ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
							label="Mot de passe"
						/>
					</FormControl>

					{/* <FormControlLabel 
						sx={{ m: 2 }} 
						control={
							<Checkbox onChange={handleClickRememberUser} checked={rememberUser} />
						}
						label="Se souvenir de moi"
					/> */}

					<Button variant="contained" type="submit" sx={{ m: 2 }}>
						Se connecter
					</Button>

					<Button sx={{ m: 2 }} href="#">Mot de passe oublié ?</Button>
				</form>
			</Paper>
			<Snackbar 
				open={showAlert}
				anchorOrigin={{ vertical:"bottom", horizontal:"center" }}
				autoHideDuration={6000}
				onClose={()=>setShowAlert(false)}
			>
				<Alert 
					severity="error"
					sx={{m:5}}
				>
					{loginErr}
				</Alert>
			</Snackbar>
		</>
	)
}

export default LoginForm;