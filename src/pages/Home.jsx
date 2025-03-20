import { Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import Slider from '../components/slider';

const Home = () => {
  const { t } = useTranslation();

	return (
		<>
			<Title order={1}>{t('home.pageTitle')}</Title>
			<Slider />
		</>
	)
} 

export default Home;