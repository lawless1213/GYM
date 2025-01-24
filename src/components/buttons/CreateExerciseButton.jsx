import { ActionIcon } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { modals } from '@mantine/modals';

function CreateExerciseButton() {
	return (
		<ActionIcon 
			mb="md" 
			mr="md" 
			size="xl" 
			variant="filled" 
			aria-label="Create" 
			style={{position: "fixed", bottom: "0", right: "0", zIndex: "1"}}
			onClick={() =>
				modals.openContextModal({
					modal: 'create',
					title: 'Create your exercise',
					size: 'lg',
				})
			}
		>
			<IconPlus />
		</ActionIcon>
	);
}

export default CreateExerciseButton;