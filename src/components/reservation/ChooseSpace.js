import {useEffect} from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';

const spaces = ["Imprimante 3d", "Montage/réparation PC", "Co-working"];

const ChooseSpace = (props) => {
	const indeterminateBool = props.checked.length > 0 && spaces.length !== props.checked.length;

	useEffect(()=>{
		props.setIsStepIsValid(props.checked.length === 0)
	})

	const handleParentChange = (e) => {
		if (e.target.checked)
		{
			props.setChecked(spaces);
		}
		else
		{
			props.setChecked([]);
		}

		props.setIsStepIsValid(props.checked.length === 0)
	};

	const handleChange = (e) => {
		if (e.target.checked)
		{
			//insert the space in checked array
			props.setChecked(checkedList => [...checkedList, e.target.value]);
		}
		else
		{
			//remove the space from checked array
			props.setChecked(
				(checkedList) => checkedList.filter(
					(checkedValue) => checkedValue !== e.target.value
				)
			); 
		}
		props.setIsStepIsValid(props.checked.length === 0)
	};

	return (
		<FormControl sx={{ m: 3 }} component="fieldset" variant="standard" error={props.checked.length === 0}>
			<FormLabel component="legend">Quel espace voulez vous réserver ?</FormLabel>
			<FormControlLabel
				label="Toutes la salle"
				control={
					<Checkbox
						checked={spaces.length === props.checked.length}
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
									checked={props.checked.includes(space)} 
									onChange={handleChange}
									value={space}
								/>
							}
						/>
					))
				}
			</Box>
			<FormHelperText>Choisissez au moins un espace à réservé</FormHelperText>
		</FormControl>
	);
}

export default ChooseSpace;