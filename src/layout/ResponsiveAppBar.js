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
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
//Material icons imports
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
//My imports
import EDN_logo from '../img/LOGO_EDN_2021_WEB.png';
import '../style/responsiveAppBar.css';

const pages = ['Accueil', 'Réservations'];
const link = ['/', 'reservation'];

const ResponsiveAppBar = (props) => {
	const iconMenu = [<HomeIcon/>, <CalendarMonthIcon/>];
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
						{
							props.connected ?
								<>
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
													{iconMenu[i] && iconMenu[i]}
													<Typography textAlign="center">&nbsp;{page}</Typography>
												</Link>
											</MenuItem>
										))}
									</Menu>
								</>
								:
								<img src={EDN_logo} alt="Logo de l'EDN" width="20%" sx={{mr: 4,}}/>
						}
					</Box>

					{/* Desktop */}
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex'} }}>
						<img src={EDN_logo} alt="Logo de l'EDN" width="20%"/>
						<Stack direction="row" spacing={2} sx={{ml:10}}>
						{
							props.connected && pages.map((page, i) => (
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

					{
						props.connected && 
							<Box sx={{ flexGrow: 0 }}>
								<Tooltip title="Compte">
									<IconButton sx={{ p: 0 }}>
										<Avatar alt="Remy Sharp" />
									</IconButton>
								</Tooltip>
							</Box>
					}
				</Toolbar>
			</Container>
		</AppBar>
	)
}

export default ResponsiveAppBar;