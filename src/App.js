import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './layout/Layout';
import Home from './components/Home';
import Reservation from './components/reservation/Reservation';

function App()
{
	const connected = true//Provisoire 

	return(
		<>
			<Layout connected={connected}>
				<BrowserRouter>
					<Routes>
						<Route path="/">
							<Route index element={<Home />} />
							<Route path="reservation" element={<Reservation />} />
							<Route path="*" element={<p>404, not found</p>} /> 
						</Route>
					</Routes>
				</BrowserRouter>
			</Layout>
		</>
	)
}

export default App;
