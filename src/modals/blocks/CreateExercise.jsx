import { Anchor, Button, Divider, Group, Paper, PasswordInput, Stack, Text, TextInput} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { useAuth } from "../../stores/context/AuthContext";
import { GoogleButton } from '../../components/buttons/GoogleButton';
import { TwitterButton } from '../../components/buttons/TwitterButton';
import { updateProfile } from "firebase/auth";

function CreateExercise() {


	const form = useForm({
		initialValues: {
			email: '',
			name: '',
			password: '',
		},

		validate: {
			email: (val) => (emailRegex.test(val) ? null : 'Invalid email'),
			password: (val) => (val.length < 6 ? 'Password should include at least 6 characters' : null),
		},
	});


	return (
		<Paper radius="md" p="xl" withBorder>

			
		</Paper>
	);
}

export default CreateExercise;