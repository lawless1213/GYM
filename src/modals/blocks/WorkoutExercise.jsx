import { useForm } from '@mantine/form';
import { useState } from 'react';
import { filterNames, groupNames } from '../../services/exerciseService.js';
import { useTranslation } from 'react-i18next';
import { useQuery } from "@apollo/client";
import { useAuth } from '../../stores/context/AuthContext.jsx';
import { useExercises } from '../../hooks/useExercises.js';
import { GET_FILTERS } from '../../queries/filters.js';
import workoutService from '../../services/workoutService';
import { Button, ColorInput, ColorPicker, Flex, Group, Loader, SimpleGrid, Stack, Textarea, TextInput, Title } from '@mantine/core';
import ExerciseCard from '../../components/ExerciseCard/index.jsx';
import { MultiSelectAsync } from '../../components/MultiSelectAsync.jsx';

function WorkoutExercise({ closeModal }) {  
	const { t } = useTranslation();
	const { currentUser } = useAuth();
	
	const [submitLoading, setSubmitLoading] = useState(false);
	const [groupExercise, setGroupExercise] = useState(groupNames.ALL);
	const [filters, setFilters] = useState({});

	const { data: filterBodyPartsData, loading: loadingBodyParts } = useQuery(GET_FILTERS, { variables: { name: "bodyPart" } });
	const { data: filterEquipmentData, loading: loadingEquipment } = useQuery(GET_FILTERS, { variables: { name: "equipment" } });

	const { exercises, loading, error } = useExercises(groupExercise, filters, currentUser);

	const handleFilterChange = (name, values) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (!values.length) {
        delete updatedFilters[name];
      } else {
        updatedFilters[name] = values;
      }

      return updatedFilters;
    });
  };

	const form = useForm({
		// initialValues: {
		// 	name: '',
		// 	description: '',
		// 	color: ''
		// },

		// validate: {
		// 	name: (val) => (val.trim().length < 3 ? 'Name must be at least 3 characters long' : null),
		// },
	});

	const handleSubmit = async (event) => {
		event.preventDefault();
		console.log('test');
		
		// if (!form.validate().hasErrors) {
		// 	setLoading(true);
		// 	const success = await workoutService.createWorkout(form.values);
	
		// 	if (success) {
		// 		closeModal();
		// 	}
			
		// 	setLoading(false);
		// }
	};

	const cards = exercises.map((item) => (
    <ExerciseCard
      key={item.id}
      exercise={item}
    />
  ));

	return (
		<>
			<form onSubmit={handleSubmit}>
				<Stack gap="md">
					<Group gap="xs">
						<MultiSelectAsync
							title={t('exercises.equipment')}
							translateKey="filters.equipment."
							selectedValue={filters[filterNames.EQUIPMENT]}
							data={filterEquipmentData?.getFilters.values || []}
							loading={loadingEquipment}
							onSelect={(value) => handleFilterChange(filterNames.EQUIPMENT, value)}
						/>
						<MultiSelectAsync
							title={t('exercises.bodyParts')}
							translateKey="filters.bodyPart."
							selectedValue={filters[filterNames.BODYPART]}
							data={filterBodyPartsData?.getFilters.values || []}
							loading={loadingBodyParts}
							onSelect={(value) => handleFilterChange(filterNames.BODYPART, value)}
						/>
					</Group>


					{
						loading && 
						<Flex flex={1} justify='center' align='center'>
							<Loader />
						</Flex>
					}
					{
						!loading && !cards.length ? (
							<Flex flex={1} justify='center' align='center'>
								<Title order={3}>Nothing found..</Title>
							</Flex>
						) : (
							<SimpleGrid cols="2">{cards}</SimpleGrid>
						)
					}
					
					<Group justify="flex-end">
						<Button fullWidth size='m' type="submit" radius="xl">
							{
								loading ?
								"Loading.." :
								"Create workout"
							} 
						</Button>
					</Group>
				</Stack>
			</form>
		</>
	)
}

export default WorkoutExercise;