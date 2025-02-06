import { useForm } from '@mantine/form';
import { useRef, useState } from 'react';
import { Button, Group, Paper, SimpleGrid, Text, Textarea, TextInput,  useMantineTheme, Stack } from '@mantine/core';
import MyDropzone from '../../components/Dropzone';
import { useStores } from '../../hooks/useStores';
import { SelectAsync } from '../../components/SelectAsync';

function CreateExercise({ closeModal, edit}) {
  const { ExerciseFilterStore, ExerciseStore } = useStores();
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const isEdit = type === "edit";
  
	const form = useForm({
		initialValues: {
			name: '',
			description: '',
      bodyPart: null,
      equipment: null,
		},

		validate: {
			name: (val) => (val.trim().length < 3 ? 'Name must be at least 3 characters long' : null),
			description: (val) => (val.trim().length < 10 ? 'Description should be at least 10 characters' : null),
      bodyPart: (val) => (!val ? 'Body part is required' : null),
      equipment: (val) => (!val ? 'Equipment is required' : null),
		},
	});

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.validate().hasErrors) {
      const success = isEdit ? await ExerciseStore.updateExercise(form.values, image, video) : await ExerciseStore.createExercise(form.values, image, video);
      if (success) closeModal();
    }
  };

  const filterBodyLoad = async (filterName) => {
    await ExerciseFilterStore.loadFilter(filterName);
    return ExerciseFilterStore[filterName];
  };

	return (
      <>
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              placeholder="Exercise"
              {...form.getInputProps('name')}
             />

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <SelectAsync
                title="Body part"
                onFirstOpen={() => filterBodyLoad('bodyPart')}
                onSelect={(value) => form.setFieldValue('bodyPart', value)}
              />
              <SelectAsync
                title="Equipment"
                onFirstOpen={() => filterBodyLoad('equipment')}
                onSelect={(value) => form.setFieldValue('equipment', value)}
              />
            </SimpleGrid>

            <Textarea
              placeholder="Description"
              minRows={5}
              {...form.getInputProps('description')}
            />

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <Paper radius="md" p="md" withBorder style={{ flex: 1 }}>
                <MyDropzone setFile={setImage} />
              </Paper>
              <Paper radius="md" p="md" withBorder style={{ flex: 1 }}>
                <MyDropzone isVideo={true} setFile={setVideo}/>
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