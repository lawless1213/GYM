import { Group, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';


const Home = () => {
  const { t } = useTranslation();

	return (
		<>
			<Title order={1}>{t('home.pageTitle')}</Title>
			
			<Group>
			</Group>
		</>
	)
} 

export default Home;