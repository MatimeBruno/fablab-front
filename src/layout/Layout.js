import ResponsiveAppBar from "./ResponsiveAppBar";
import Container from '@mui/material/Container';
import Login from "../components/Login";

const Layout = ({children, user, setUser}) => {
	return(
		<div>
			<ResponsiveAppBar user={user}/>
			<Container style={{maxWidth:"1700px"}}>
				{
					(user !== null)? children : <Login setUser={setUser}/>
				}
			</Container>
			<footer id="main-footer">
				<img src="https://www.ecoledunumerique.re/wp-content/uploads/2022/02/financeurs-all-edn.png" alt="logos" height="191" useMap="#Map" border="0"/>
			</footer>
		</div>
	)
}

export default Layout;