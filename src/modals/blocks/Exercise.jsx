import { useForm } from '@mantine/form';
import { useRef, useState } from 'react';
import { Button, Group, Paper, SimpleGrid, Text, Textarea, TextInput,  useMantineTheme, Stack } from '@mantine/core';
import MyDropzone from '../../components/Dropzone';
import { useStores } from '../../hooks/useStores';
import { MultiSelectAsync } from '../../components/MultiSelectAsync';

function Exercise({ closeModal, exercise = null}) {
  const { ExerciseFilterStore, ExerciseStore } = useStores();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

	const form = useForm({
		initialValues: {
			name: exercise ? exercise.name : '',
			description: exercise ? exercise.description : '',
      bodyPart: exercise ? exercise.bodyPart : null,
      equipment: exercise ? exercise.equipment : null,
      id: exercise ? exercise.id : ''
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
      setLoading(true);
      const success = exercise 
        ? await ExerciseStore.updateExercise(exercise.id, form.values, image, video)
        : await ExerciseStore.createExercise(form.values, image, video);
  
      if (success) {
        closeModal();
      }
      setLoading(false);
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

              <MultiSelectAsync
                selectedValue = { exercise ? exercise.bodyPart : [] }
                title="Body part"
                onFirstOpen={() => filterBodyLoad('bodyPart')}
                onSelect={(value) => form.setFieldValue('bodyPart', value)}
              />
              <MultiSelectAsync
                selectedValue = { exercise ? exercise.equipment : [] }
                title="Equipment"
                onFirstOpen={() => filterBodyLoad('equipment')}
                onSelect={(value) => form.setFieldValue('equipment', value)}
              />

            <Textarea
              placeholder="Description"
              minRows={5}
              {...form.getInputProps('description')}
            />

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <Paper radius="md" p="md" withBorder style={{ flex: 1 }}>
                <MyDropzone setFile={setImage} urlSelectedFile={exercise ? exercise.preview : null}/>
              </Paper>
              <Paper radius="md" p="md" withBorder style={{ flex: 1 }}>
                <MyDropzone isVideo={true} setFile={setVideo} urlSelectedFile={exercise ? exercise.video : null}/>
              </Paper>
            </SimpleGrid>

            <Group justify="flex-end">
              <Button fullWidth size='m' type="submit" radius="xl">
                {
                  loading ?
                  "Loading.." :
                  exercise ? "Update exercise" : "Create exercise"
                } 
              </Button>
            </Group>
          </Stack>
        </form>
      </>
	);
}

export default Exercise;