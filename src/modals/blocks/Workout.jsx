import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import workoutService from '../../services/workoutService';
import { ColorInput, ColorPicker, Group, Stack, Textarea, TextInput } from '@mantine/core';

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
      console.log(form.values);
  
      setLoading(true);
  
      if (success) {
        closeModal();
      }
      setLoading(false);
    }
  };

	return (
		<>
			<form>
				<Stack gap="md">
					<TextInput
						placeholder="Workout name"
						{...form.getInputProps('name')}
					/>
					<Group >
						<Textarea
							placeholder="Workout description"
							flex="1"
							h="125px"
							{...form.getInputProps('description')}
						/>
						<ColorPicker
							size="xs"
						/>
					</Group>
				</Stack>
			</form>
		</>
	)
}

export default Workout;