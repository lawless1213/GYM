import { useEffect } from 'react';
import { Title, SimpleGrid } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores.jsx';
import ExerciseCard from '../components/ExerciseCard/index.jsx';

const Exercises = observer(() => {
	const { AllExerciseStore } = useStores();

	useEffect(() => {
		AllExerciseStore.loadItems();
	}, []);

	const cards = AllExerciseStore.items.map((item) => {
		return (
			<ExerciseCard
				name = {item.name}
				preview = {item.preview}
				video = {item.video}
				equipment = {item.equipment}
				bodyPart = {item.bodyPart}
			/>
		);
	});
	

	return (
		<>
			<Title mb="md" order={1}>Exercise Library</Title>
			<SimpleGrid
				cols={{ base: 1, sm: 2, lg: 4 }}
			>
				{cards}
			</SimpleGrid>
		</>
	)
})

export default Exercises;