import { useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import ChooseSpace from './ChooseSpace';
import DateTimeSelect from './DateTimeSelect';

const steps = ["Choix de l'espace", "Choix de la date et l'heure", 'Récapitulatif'];

const Reservation = () => {
	const [activeStep, setActiveStep] = useState(0);
	const [skipped, setSkipped] = useState(new Set());
	const [isStepIsValid, setIsStepIsValid] = useState(null);
	const [checked, setChecked] = useState([]);// Checked space (step 1)

	const isStepSkipped = (step) => {
		return skipped.has(step);
	};

	const handleNext = () => {
		if (isStepIsValid)
		{
			return;// if step is invalid leave the function
		}

		let newSkipped = skipped;

		if (isStepSkipped(activeStep))
		{
			newSkipped = new Set(newSkipped.values());
			newSkipped.delete(activeStep);
		}

		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped(newSkipped);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	return (
		<Box sx={{ width: '100%', p:5 }}>
			<Stepper activeStep={activeStep}>
				{steps.map((label, index) => {
					const stepProps = {};
					const labelProps = {};
					if (isStepSkipped(index)) {
						stepProps.completed = false;
					}
					return (
						<Step key={label} {...stepProps}>
							<StepLabel {...labelProps}>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
			<>
				<Box component="div" sx={{ p: 5, display:"flex", justifyContent:"center"}}>
					{
						(activeStep === 0)?
							<ChooseSpace 
								setIsStepIsValid={setIsStepIsValid}
								setChecked={setChecked}
								checked={checked}
							/>
							:
							(activeStep === 1)?
								<DateTimeSelect/>
								:
								""

					}
				</Box>
				<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
					<Button
						color="inherit"
						disabled={activeStep === 0}
						onClick={handleBack}
						sx={{ mr: 1 }}
					>
						Précédent
					</Button>
					<Box sx={{ flex: '1 1 auto' }} />

					<Button onClick={handleNext}>
						{activeStep === steps.length - 1 ? 'Fini' : 'Suivant'}
					</Button>
				</Box>
			</>
		</Box>
	);
}

export default Reservation;