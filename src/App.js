import React, {useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './layout/Layout';
import Home from './components/Home';
import MyReservation from './components/MyReservation';
import Compte from './components/Compte';

function App()
{
	const [user, setUser] = useState(sessionStorage.getItem("u"));

	useEffect(()=>{
		const checkUser = setInterval(() => {
			if(sessionStorage.getItem("u") === null)
			{
				setUser(null);
			}
		}, 60 * 1000);

		// clearing interval
		return () => clearInterval(checkUser);
	})

	return(
		<>
			<BrowserRouter>
				<Layout user={user} setUser={setUser}>
					<Routes>
						<Route path="/">
							<Route index element={<Home user={user} />} />
							<Route path="myReservation" element={<MyReservation user={user} />} />
							<Route path="compte" element={<Compte setUser={setUser} user={user}/>} />
							<Route path="*" element={<p>404, not found</p>} /> 
						</Route>
					</Routes>
				</Layout>
			</BrowserRouter>
		</>
	)
}

export default App;
