import { ActionIcon, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { useAuth } from '../../stores/context/AuthContext';

function CreateExerciseButton() {
	const { currentUser } = useAuth();

	const buttonHandler = () => {
		if (currentUser) {
			modals.openContextModal({
				modal: 'create',
				title: <Title order={2}>Create your exercise</Title>,
				size: 'xl',
			})
		} else {
			modals.openContextModal({
				modal: 'auth',
				size: 'lg',
			})
		}
	}

	return (
		<ActionIcon 
			mb="md" 
			mr="md" 
			size="xl" 
			variant="filled" 
			aria-label="Create" 
			style={{position: "fixed", bottom: "0", right: "0", zIndex: "1"}}
			onClick={buttonHandler}
		>
			<IconPlus />
		</ActionIcon>
	);ц
}

export default CreateExerciseButton;