import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import workoutService from '../../services/workoutService';
import { Button, ColorInput, ColorPicker, Group, Stack, Textarea, TextInput } from '@mantine/core';

function Workout({ closeModal }) {  
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);

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
			const success = await workoutService.createExercise(form.values);
  
      if (success) {
        closeModal();
      }
      
      setLoading(false);
    }
  };

	return (
		<>
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
					
					<Group justify="flex-end">
						<Button fullWidth size='m' type="submit" radius="xl">
							{
								loading ?
								"Loading.." :
								"Create workout"
							} 
						</Button>
					</Group>
				</Stack>
			</form>
		</>
	)
}

export default Workout;