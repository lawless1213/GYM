import { useForm } from '@mantine/form';
import { useRef } from 'react';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import { Button, Group, Text, useMantineTheme, Paper } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';

function CreateExercise() {
	const theme = useMantineTheme();
  const openRef = useRef(null);

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
			<Dropzone
        openRef={openRef}
        onDrop={() => {}}
        // className={classes.dropzone}
        radius="md"
        accept={[MIME_TYPES.pdf]}
        maxSize={30 * 1024 ** 2}
      >
        <div style={{ pointerEvents: 'none' }}>
          <Group justify="center">
            <Dropzone.Accept>
              <IconDownload size={50} color={theme.colors.blue[6]} stroke={1.5} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload size={50} stroke={1.5} />
            </Dropzone.Idle>
          </Group>

          <Text ta="center" fw={700} fz="lg" mt="xl">
            <Dropzone.Accept>Drop files here</Dropzone.Accept>
            <Dropzone.Reject>Pdf file less than 30mb</Dropzone.Reject>
            <Dropzone.Idle>Upload resume</Dropzone.Idle>
          </Text>
          <Text ta="center" fz="sm" mt="xs" c="dimmed">
            Drag&apos;n&apos;drop files here to upload. We can accept only <i>.pdf</i> files that
            are less than 30mb in size.
          </Text>
        </div>
      </Dropzone>

      <Button size="md" radius="xl" onClick={() => openRef.current?.()}>
        Select files
      </Button>
			
		</Paper>
	);
}

export default CreateExercise;