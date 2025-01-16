import { useState } from 'react';
import { Group, Switch, Stack, Title } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useStores } from '../hooks/useStores.jsx';

const Settings = () => {
	const { SettingStore } = useStores();
	const [checked, setChecked] = useState(SettingStore.isVideoPreview);

	const previewToggler = (event) => {
		setChecked(event.currentTarget.checked);
		SettingStore.togglePreview();
	}

	return (
		<>
			<Title order={1}>Settings</Title>
			<Stack mt="md" gap="md">
				<Switch
					checked={checked}
					onChange={previewToggler}
					// color="teal"
					size="md"
					label="Video preview in list of exercises"
					labelPosition='left'
					thumbIcon={
						checked ? (
							<IconCheck size={12} color="var(--mantine-color-teal-6)" stroke={3} />
						) : (
							<IconX size={12} color="var(--mantine-color-red-6)" stroke={3} />
						)
					}
				/>
			</Stack>
		</>
	)
} 

export default Settings;