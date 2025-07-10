import { useQuery } from '@apollo/client';
import { Title, SimpleGrid, Loader, Text, Stack, Flex } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { GET_USER_WORKOUTS } from '../queries/workouts';
import WorkoutCard from '../components/WorkoutCard';
import workoutService from '../services/workoutService';

function Programs() {
  const { t } = useTranslation();
  const { data, loading, error } = useQuery(GET_USER_WORKOUTS);

  if (loading) {
    return <Flex flex={1} justify='center' align='center'>
              <Loader />
            </Flex>;
  }

  const workouts = data?.getUserWorkouts || [];

  return (
    <Stack>
      <Title order={1}>{t('workouts.pageTitle')}</Title>
      
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {workouts.length !== 0 && 
          workouts.map(workout => (
            <WorkoutCard
              key={workout.id}
              id={workout.id}
              name={workout.name}
              description={workout.description}
              color={workout.color}
              calories={workout.calories}
              exercises={workout.exercises}
              onDeleteWorkout={() => workoutService.deleteWorkout({ id: workout.id })}
            />
          ))
        }
        <WorkoutCard create={true}/>
      </SimpleGrid>
    </Stack>
  );
}

export default Programs; 