import { useMantineTheme, Title, Text, Card, Button, Group } from '@mantine/core';
import { useTimer } from '../../hooks/timer.js';
import CircleProgress from '../../components/circleProgress.jsx';

const Exercise = () => {
	const timeAmount = 60;
	const { time, isRunning, isFinished , start, pause, reset } = useTimer(timeAmount);

	const theme = useMantineTheme();
	const ringColor = theme.colors.myColor[7]; 

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
			<Title order={1} ta="center" mb="md">
				title
			</Title>

			<Card.Section withBorder>
				<CircleProgress time={time} maxTime={timeAmount} isFinished={isFinished} color={ringColor}/>

				<Group justify="center" mb="md">
					{!isRunning && <Button variant="light" onClick={start}>
						{time > 0 ? "CONTINUE" : "START"}
					</Button>}
					{isRunning && <Button variant="light" onClick={pause}>PAUSE</Button>}
					{time !== 0 && <Button variant="light" onClick={reset}>RESET</Button>}
				</Group>
			</Card.Section>
			
			<Text ta="center" mt="md" size="md" c="dimmed">
				description
			</Text>
		</Card>
  );
};

export default Exercise;