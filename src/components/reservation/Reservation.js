import {useState} from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const spaces = ["Espace 1", "Espace 2", "Espace 3", "Espace 4"];

const Reservation = () => {
	const [checked, setChecked] = useState([]);
	const indeterminateBool = checked.length > 0 && spaces.length !== checked.length;

	const handleParentChange = (e) => {
		if (e.target.checked)
		{
			setChecked(spaces);
		} 
		else
		{
			setChecked([]);
		}
	};

	const handleChange = (e) => {
		if (e.target.checked)
		{
			//insert the space in checked array
			setChecked(checkedList => [...checkedList, e.target.value]);
		}
		else
		{
			//remove the space from checked array
			setChecked(
				(checkedList) => checkedList.filter(
					(checkedValue) => checkedValue !== e.target.value
				)
			); 
		}
	};

	return (
		<div>
			<FormControlLabel
				label="Espaces"
				control={
					<Checkbox
						checked={spaces.length === checked.length}
						indeterminate={indeterminateBool}
						onChange={handleParentChange}
					/>
				}
			/>
			<Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
				{
					spaces.map((space, i)=>(
						<FormControlLabel
							key={i}
							label={space}
							control={
								<Checkbox 
									checked={checked.includes(space)} 
									onChange={handleChange}
									value={space}
								 />
							}
						/>
					))
				}
			</Box>
		</div>
	);
}

export default Reservation;