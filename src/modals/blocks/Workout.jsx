import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import workoutService from '../../services/workoutService';
import { Button, ColorInput, ColorPicker, Stepper, Group, Stack, Textarea, TextInput } from '@mantine/core';

function Workout({ closeModal }) {  
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);

	const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

	const form = useForm({
		initialValues: {
			name: '',
			description: '',
			color: ''
		},

		validate: {
			name: (val) => (val.trim().length < 3 ? 'Name must be at least 3 characters long' : null),
		},
	});

	const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.validate().hasErrors) {
      setLoading(true);
			const success = await workoutService.createWorkout(form.values);
  
      if (success) {
        closeModal();
      }
      
      setLoading(false);
    }
  };

	return (
		<>
		<Stepper iconSize={32} active={active} onStepClick={setActive} allowNextStepsSelect={false}>
        <Stepper.Step label="Create" description="Create a program">
          <form onSubmit={handleSubmit}>
						<Stack gap="md">
							<Group>
								<ColorInput 
									w="130px" 
									disallowInput 
									placeholder='Color'
									{...form.getInputProps('color')}
								/>
								<TextInput
									flex="1"
									placeholder="Workout name"
									{...form.getInputProps('name')}
								/>
							</Group>
							
							<Textarea
								placeholder="Workout description"
								h="100%"
								{...form.getInputProps('description')}
							/>
							
							{/* <Group justify="flex-end">
								<Button fullWidth size='m' type="submit" radius="xl">
									{
										loading ?
										"Loading.." :
										"Create workout"
									} 
								</Button>
							</Group> */}
						</Stack>
					</form>
        </Stepper.Step>
        <Stepper.Step label="Select" description="Select exercises">
          Step 2 content: Select exercises
        </Stepper.Step>
        <Stepper.Step label="Confirm" description="Confirm program">
          Step 3 content: Confirm program
        </Stepper.Step>
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep}>Next step</Button>
      </Group>
		</>
	)
}

export default Workout;