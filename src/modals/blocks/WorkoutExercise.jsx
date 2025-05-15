import { useState } from 'react';
import { Button, Group, Stack } from '@mantine/core';
import { useExerciseCatalog } from '../../hooks/useExerciseCatalog.js';
import { ExerciseCatalogFilters } from '../../components/ExerciseCatalogFilters.jsx';
import { ExerciseCatalogDisplay } from '../../components/ExerciseCatalogDisplay.jsx';

function WorkoutExercise({ closeModal }) {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const { exercises, loading, filterOptions, filters, handleFilterChange, currentUser } = useExerciseCatalog();

  const handleSelectExercise = (id) => {
    if (!selectedExercises.includes(id)) {
      setSelectedExercises([...selectedExercises, id]);
    } else {
      setSelectedExercises(selectedExercises.filter(item => item !== id));
    }
  }

  const handleSubmitSelectedExercises = async () => {
    console.log(selectedExercises);
  };

  return (
    <>
      <Stack gap="md">
				<ExerciseCatalogFilters
					groupExercise={null}
					setGroupExercise={() => {}}
					filters={filters}
					handleFilterChange={handleFilterChange}
					filterOptions={filterOptions}
					currentUser={currentUser}
					showGroupButtons={false}
				/>

				<ExerciseCatalogDisplay
					exercises={exercises}
					loading={loading}
					selectedExercises={selectedExercises}
					handleSelectExercise={handleSelectExercise}
					simpleCards={true}
				/>

				<Group justify="center">
					<Button onClick={handleSubmitSelectedExercises} loading={false}>
						Add to workout
					</Button>
				</Group>
			</Stack>
    </>
  )
}

export default WorkoutExercise;