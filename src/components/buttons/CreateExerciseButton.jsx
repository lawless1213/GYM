import { ActionIcon, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { useAuth } from '../../stores/context/AuthContext';

function CreateExerciseButton() {
	const { currentUser } = useAuth();

	const buttonHandler = () => {
		if (currentUser) {
			modals.openContextModal({
				modal: 'exercise',
				title: <Text span size="xl" fw={700}>Create your exercise</Text>,
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