import { SimpleGrid, Flex, Loader, Title } from '@mantine/core';
import ExerciseCard from './ExerciseCard/index.jsx'; // Переконайтеся, що шлях правильний

export function ExerciseCatalogDisplay({ exercises, loading, selectedExercises, handleSelectExercise, simpleCards = false }) {
  if (loading) {
    return (
      <Flex flex={1} justify='center' align='center'>
        <Loader />
      </Flex>
    );
  }

  const cards = exercises.map((item) => (
    <ExerciseCard
      key={item.id}
      exercise={item}
      simple={simpleCards}
      active={selectedExercises ? selectedExercises.some(selected => selected.exerciseId === item.id) : false}
      onClick={handleSelectExercise}
    />
  ));

  if (!cards.length) {
    return (
      <Flex flex={1} justify='center' align='center'>
        <Title order={3}>Nothing found..</Title>
      </Flex>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 4, xl: 5 }}>{cards}</SimpleGrid>
  );
}