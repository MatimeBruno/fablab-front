import ResponsiveAppBar from "./ResponsiveAppBar";
import Container from '@mui/material/Container';
import Login from "../components/Login";

const Layout = ({children, user, setUser}) => {
	return(
		<div>
			<ResponsiveAppBar user={user}/>
			<Container maxWidth="md">
				{
					(user !== null)? children : <Login setUser={setUser}/>
				}
			</Container>
		</div>
	)
}

export default Layout;