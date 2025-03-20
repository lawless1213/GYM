import { Group, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import WorkoutCalendar from '../components/workoutCalendar';

const Home = () => {
  const { t } = useTranslation();

	return (
		<>
			<Title order={1}>{t('home.pageTitle')}</Title>
			
			<Group>
				<WorkoutCalendar />
			</Group>
		</>
	)
} 

export default Home;