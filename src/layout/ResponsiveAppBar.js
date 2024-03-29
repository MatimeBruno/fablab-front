// React imports
import React, { useState } from 'react';
import { Link } from "react-router-dom";
//Material layout imports
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
// Material elements imports
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
//Material icons imports
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
//My imports
import EDN_logo from '../img/LOGO_EDN_2021_WEB.png';
import '../style/responsiveAppBar.css';

const pages = ['Accueil', 'Mes réservations', 'Compte'];
const link = ['/', 'myReservation', 'compte'];

const ResponsiveAppBar = (props) => {
	const iconMenu = [<HomeIcon/>, <CalendarMonthIcon/>, <AccountCircleIcon/>];
	const [showMobileMenu, setShoMobileMenu] = useState(null);
	const openMenuMobile = Boolean(showMobileMenu);

	const handleMenuMobile = (e) => {
		setShoMobileMenu(e.currentTarget);
	};

	return (
		<AppBar position="static" sx={{backgroundColor:'white'}}>
			<Container maxWidth="false">
				<Toolbar disableGutters>
					{/* Mobile */}
					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<Grid container sx={{alignItems:'center'}}>
							<Grid item xs={5} md={5}>
								<img src={EDN_logo} alt="Logo de l'EDN" width="100%" sx={{mr: 4,}}/>
							</Grid>
							<Grid item xs={3} md={3} style={{textAlign:"end"}}>
								{
									(props.user !== null) ?
										<Stack direction="row" spacing={2} sx={{ml:20}}>
											<IconButton
												size="large"
												aria-label="account of current user"
												aria-controls={openMenuMobile ? "menu-appbar" : undefined}
												aria-haspopup="true"
												aria-expanded={openMenuMobile ? 'true' : undefined}
												color="inherit"
												onClick={handleMenuMobile}
											>
												<MenuIcon color='primary' />
											</IconButton>
											<Menu
												open={openMenuMobile}
												anchorEl={showMobileMenu}
												onClose={()=>setShoMobileMenu(null)}
												id="menu-appbar"
												anchorOrigin={{
													vertical: 'bottom',
													horizontal: 'left',
												}}
												keepMounted
												transformOrigin={{
													vertical: 'top',
													horizontal: 'left',
												}}
												sx={{
													display: { xs: 'block', md: 'none' },
													position:"absolute"
												}}
												MenuListProps={{
													'aria-labelledby': 'basic-button',
												}}
											>
												{pages.map((page, i) => (
													<MenuItem key={page}>
														<Link to={link[i]}>
															<Grid container sx={{alignItems:'center'}}>
																<Grid item xs={3} md={3}>
																	{iconMenu[i] && iconMenu[i]}
																</Grid>
																<Grid item xs={3} md={3}>
																	<Typography textAlign="center">&nbsp;{page}</Typography>
																</Grid>
															</Grid>
														</Link>
													</MenuItem>
												))}
											</Menu>
										</Stack>
										:
										<img src={EDN_logo} alt="Logo de l'EDN" width="20%" sx={{mr: 4,}}/>
								}
							</Grid>
						</Grid>
					</Box>

					{/* Desktop */}
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex'} }}>
						<img src={EDN_logo} alt="Logo de l'EDN" width="20%"/>
						<Stack direction="row" spacing={2} sx={{ml:10}}>
						{
							props.user && pages.map((page, i) => (
								<Link to={link[i]} key={page}>
									<Button
										sx={{color:"black"}}
										startIcon={iconMenu[i] && iconMenu[i]}
									>
										{page}
									</Button>
								</Link>
							))
						}
						</Stack>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	)
}

export default ResponsiveAppBar;