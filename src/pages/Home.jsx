import { Group, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import WorkoutSchedule from '../components/workoutSchedule';


const Home = () => {
  const { t } = useTranslation();

	return (
		<>
			<WorkoutSchedule />
		</>
	)
} 

export default Home;