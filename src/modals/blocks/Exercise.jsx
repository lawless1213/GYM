import { useForm } from '@mantine/form';
import { useState } from 'react';
import { Button, Group, Paper, SimpleGrid, Text, Textarea, TextInput, NumberInput,  useMantineTheme, Stack, Switch, SegmentedControl, Flex } from '@mantine/core';
import MyDropzone from '../../components/Dropzone';
import { MultiSelectAsync } from '../../components/MultiSelectAsync';
import { GET_FILTERS } from '../../queries/filters';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import exerciseService from '../../services/exerciseService';

function Exercise({ closeModal, exercise = null}) {  
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(exercise && exercise.preview ? exercise.preview : '');
  const [video, setVideo] = useState(exercise && exercise.video ? exercise.video : '');

	const form = useForm({
		initialValues: {
			name: exercise ? exercise.name : '',
			description: exercise ? exercise.description : '',
      bodyPart: exercise && Array.isArray(exercise.bodyPart) ? [...exercise.bodyPart] : [],
      equipment: exercise && Array.isArray(exercise.equipment) ? [...exercise.equipment] : [],
      id: exercise ? exercise.id : '',
      type: exercise ? exercise.type : 'Reps',
      valuePerSet: exercise ? exercise.valuePerSet : 0,
      caloriesPerSet: exercise ? exercise.caloriesPerSet : 0
		},

		validate: {
			name: (val) => (val.trim().length < 3 ? 'Name must be at least 3 characters long' : null),
			description: (val) => (val.trim().length < 10 ? 'Description should be at least 10 characters' : null),
      bodyPart: (val) => (!val ? 'Body part is required' : null),
      equipment: (val) => (!val ? 'Equipment is required' : null),
      valuePerSet: (val) => (val < 1 ? 'Value per set must be greater than 0' : null),
      caloriesPerSet: (val) => (val < 0 ? 'Calories per set must be non-negative' : null),
		},
	});

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.validate().hasErrors) {
      setLoading(true);
      
      const success = exercise 
        ? await exerciseService.updateExercise(form.values, image, video)
        : await exerciseService.createExercise(form.values, image, video);
  
      if (success) {
        closeModal();
      }
      setLoading(false);
    }
  };

  const { data: filterBodyPartsData, loading: loadingBodyParts } = useQuery(GET_FILTERS, { variables: { name: "bodyPart" } });
  const { data: filterEquipmentData, loading: loadingEquipment } = useQuery(GET_FILTERS, { variables: { name: "equipment" } });

	return (
      <>
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              placeholder="Exercise"
              {...form.getInputProps('name')}
            />
            <MultiSelectAsync
              selectedValue={exercise ? exercise.equipment : []}
              title={t('exercises.equipment')}
              translateKey="filters.equipment."
              data={filterEquipmentData?.getFilters.values || []}
              loading={loadingEquipment}
              onSelect={(value) => form.setFieldValue('equipment', value)}
            />
            <MultiSelectAsync
              selectedValue={exercise ? exercise.bodyPart : []}
              title={t('exercises.bodyParts')}
              translateKey="filters.bodyPart."
              data={filterBodyPartsData?.getFilters.values || []}
              loading={loadingBodyParts}
              onSelect={(value) => form.setFieldValue('bodyPart', value)}
            />

            <Textarea
              placeholder="Description"
              minRows={5}
              {...form.getInputProps('description')}
            />

            <Group justify='space-between'>
              <Group gap='4'>
                <NumberInput
                  placeholder={t('exercise.valuePerSet')}
                  min={1}
                  {...form.getInputProps('valuePerSet')}
                />
                <SegmentedControl
                  value={form.values.type || 'reps'} 
                  onChange={(value) => form.setFieldValue('type', value)}
                  data={[
                    { label: t('exercise.type.reps'), value: 'reps' },
                    { label: t('exercise.type.seconds'), value: 'time' }
                  ]}
                  required
                />
              </Group>
              <Group gap='4'>
                <NumberInput
                  placeholder={t('exercise.caloriesPerSet')}
                  min={0}
                  {...form.getInputProps('caloriesPerSet')}
                />
                <Text>ccal</Text>
              </Group>
            </Group>

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