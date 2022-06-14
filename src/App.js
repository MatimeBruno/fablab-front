import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './layout/Layout';
import Home from './components/Home';
import Reservation from './components/reservation/Reservation';
import Compte from './components/Compte';

function App()
{
	const connected = true//Provisoire 

	return(
		<>
			<BrowserRouter>
				<Layout connected={connected}>
					<Routes>
						<Route path="/">
							<Route index element={<Home />} />
							<Route path="reservation" element={<Reservation />} />
							<Route path="compte" element={<Compte/>} />
							<Route path="*" element={<p>404, not found</p>} /> 
						</Route>
					</Routes>
				</Layout>
			</BrowserRouter>
		</>
	)
}

export default App;
