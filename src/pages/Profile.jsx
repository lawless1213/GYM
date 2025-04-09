import { useMantineTheme, Title, SimpleGrid, Stack } from '@mantine/core';
import { useAuth } from '../stores/context/AuthContext';
import { AreaChart } from '@mantine/charts';
import { useTranslation } from 'react-i18next';


export const data = [
  {
    date: 'Mar 22',
    weight: 90,
		chest: 110,
		waist: 70,
		hips: 110,
  },
	{
    date: 'Apr 22',
    weight: 70,
		chest: 100,
		waist: 95,
		hips: 100,
  },
	{
    date: 'May 22',
    weight: 82,
		chest: 130,
		waist: 90,
		hips: 130,
  },
];

const charts = ['weight', 'chest', 'waist', 'hips'];

const Profile = () => {
	const { t } = useTranslation();
	const theme = useMantineTheme();
	const color = theme.colors.myColor[7]; 
	
	return (
		<>
			<Title order={1} mb="md">{t('profile.pageTitle')}</Title>
			<Stack>
				<SimpleGrid cols={{ base: 1, md: 2 }}>
					{charts.map(chart => (
							<Stack key={chart}>
								<Title ta='center' order={5}>{chart}</Title>
								<AreaChart
									key={chart}
									h={300}
									data={data}
									dataKey="date"
									series={[
										{ name: chart, color: color },
									]}
									curveType="bump"
									tickLine="none"
								/>
							</Stack>
						))
					}
				</SimpleGrid>
			</Stack>
		</>
	)
} 

export default Profile;