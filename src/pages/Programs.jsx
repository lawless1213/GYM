import { useQuery } from '@apollo/client';
import { Title, SimpleGrid, Loader, Text, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { GET_USER_WORKOUTS } from '../queries/workouts';
import WorkoutCard from '../components/WorkoutCard';
import WorkoutCalendar from '../components/workoutCalendar';

function Programs() {
  const { t } = useTranslation();
  const { data, loading, error } = useQuery(GET_USER_WORKOUTS);

  if (loading) {
    return <Loader />;
  }

  const workouts = data?.getUserWorkouts || [];

  return (
    <Stack>
      <Title order={1}>{t('workouts.pageTitle')}</Title>
			{/* <WorkoutCalendar /> */}
      
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {workouts.length !== 0 && 
          workouts.map(workout => (
            <WorkoutCard
              key={workout.id}
              id={workout.id}
              name={workout.name}
              color={workout.color}
              calories={workout.calories}
              exercises={workout.exercises}
            />
          ))
        }
        <WorkoutCard create={true}/>
      </SimpleGrid>
    </Stack>
  );
}

export default Programs; 