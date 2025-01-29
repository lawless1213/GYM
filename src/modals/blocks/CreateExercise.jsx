import { useForm } from '@mantine/form';
import { useRef } from 'react';
import { Button, Group, Paper, SimpleGrid, Text, Textarea, TextInput,  useMantineTheme, Stack } from '@mantine/core';
import MyDropzone from '../../components/Dropzone';
import { useStores } from '../../hooks/useStores';
import { SelectAsync } from '../../components/SelectAsync';

function CreateExercise() {
  const { ExerciseFilterStore } = useStores();

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

  const filterBodyLoad = async (filterName) => {
    await ExerciseFilterStore.loadFilter(filterName);
    return ExerciseFilterStore[filterName];
  };


	return (
      <>
      <form onSubmit={(event) => event.preventDefault()}>
          <Stack gap="md">
            <TextInput placeholder="Exercise" />

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <SelectAsync
                title="Body part"
                onFirstOpen={() => filterBodyLoad('bodyPart')}
                // onSelect={(value) => filterSelectHandler('bodyPart', value)}
              />
              <SelectAsync
                title="Equipment"
                onFirstOpen={() => filterBodyLoad('equipment')}
                // onSelect={(value) => filterSelectHandler('equipment', value)}
              />
            </SimpleGrid>

            <Textarea
              placeholder="Description"
              minRows={3}
            />

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <Paper radius="md" p="md" withBorder style={{ flex: 1 }}>
                <MyDropzone />
              </Paper>
              <Paper radius="md" p="md" withBorder style={{ flex: 1 }}>
                <MyDropzone isVideo={true}/>
              </Paper>
            </SimpleGrid>

            <Group justify="flex-end">
              <Button fullWidth size='m' type="submit" radius="xl">
                Create exercise
              </Button>
            </Group>
          </Stack>
        </form>
      </>
	);
}

export default CreateExercise;