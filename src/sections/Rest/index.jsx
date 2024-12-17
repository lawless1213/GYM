import { useMantineTheme, Title, Text, Card, Button, Group } from '@mantine/core';
import { useTimer } from '../../hooks/timer.js';
import CircleProgress from '../../components/circleProgress.jsx';

const Rest = () => {
	const timeAmount = 20;
	const { time, isRunning, isFinished , start, pause, reset } = useTimer(timeAmount);
	start();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
			<Title order={1} ta="center" mb="md">
				Rest 20sec
			</Title>

			<Card.Section withBorder>
				<CircleProgress time={time} maxTime={timeAmount} isFinished={isFinished}/>
			</Card.Section>
			
			<Text ta="center" mt="md" size="md" c="dimmed">
				Next excercise: description
			</Text>
		</Card>
  );
};

export default Rest;