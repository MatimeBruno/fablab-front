import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import FormHelperText from '@mui/material/FormHelperText';
import {getSpaces} from '../../actions/reservation';

// const spaces = ["Imprimante 3d", "Montage/réparation PC", "Co-working"];

const ChooseSpace = (props) => {
	const [spaces, setSpaces] = useState(null)
	const indeterminateBool = props.checkedSpace.length > 0 && spaces.length !== props.checkedSpace.length;

	const getSpacesData = async () => {
		const spaces = await getSpaces();
		setSpaces(spaces)
	}

	useEffect(()=>{
		(spaces === null) && getSpacesData();
		props.setIsStepIsInvalid(props.checkedSpace.length === 0)
	})

	const handleParentChange = (e) => {
		if (e.target.checked)
		{
			const spaceIdArr = []
			spaces.forEach(element => {
				const spaceId = Number(element.id_espace);
				spaceIdArr.push(spaceId);
			});
			props.setCheckedSpace(spaceIdArr);	
		}
		else
		{
			props.setCheckedSpace([]);
		}

		props.setIsStepIsInvalid(props.checkedSpace.length === 0)
	};

	const handleChange = (e) => {
		const spaceId = Number(e.target.value);

		if (e.target.checked)
		{
			//insert the space in checked array
			props.setCheckedSpace(checkedList => [...checkedList, spaceId]);
		}
		else
		{
			//remove the space from checked array
			props.setCheckedSpace(
				(checkedList) => checkedList.filter(
					(checkedValue) => checkedValue !== spaceId
				)
			); 
		}
		props.setIsStepIsInvalid(props.checkedSpace.length === 0)
	};

	return (
		<FormControl sx={{ m: 3 }} component="fieldset" variant="standard" error={props.checkedSpace.length === 0}>
			{
				(spaces === false) ?
					<Alert severity="error">
						<AlertTitle>Erreur</AlertTitle>
						Impossible de charger les espaces disponibles
					</Alert>
					:
					<>
						<FormLabel component="legend">Quel espace voulez vous réserver ?</FormLabel>
						<FormControlLabel
							label="Toute la salle"
							control={
								<Checkbox
									checked={spaces!== null && spaces.length === props.checkedSpace.length}
									indeterminate={indeterminateBool}
									onChange={handleParentChange}
								/>
							}
						/>
						<Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
							{
								(spaces !== null) ?
									spaces.map((space, i)=>(
										<FormControlLabel
											key={i}
											label={space.intitule}
											control={
												<Checkbox
													checked={props.checkedSpace.includes(space.id_espace)} 
													onChange={handleChange}
													value={space.id_espace}
												/>
											}
										/>
									))
									:
									<span>Veuillez patienter...</span>
						}
						</Box>
						<FormHelperText>Choisissez au moins un espace à réservé</FormHelperText>
					</>
			}
		</FormControl>
	);
}

export default ChooseSpace;