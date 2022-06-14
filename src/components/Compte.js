import {useState} from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// Temporary for visual desmontration --------------------------


const Compte = (props) => {
	const [sortBy, setSortBy] = useState("DESC");

	const handleSortChange = (e) => {
		setSortBy(e.target.value);
	}

	return(
        
        <Button variant="contained">SE DECONNECTER</Button>
	)
}

export default Compte;