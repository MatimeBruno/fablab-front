import ResponsiveAppBar from "./ResponsiveAppBar";
import Container from '@mui/material/Container';
import Login from "../components/Login";

const Layout = ({children, connected, ...rest}) => {
	return(
		<div>
			<ResponsiveAppBar connected={connected}/>
			<Container maxWidth="md">
				{
					(connected)? children : <Login/>
				}
			</Container>
		</div>
	)
}

export default Layout;