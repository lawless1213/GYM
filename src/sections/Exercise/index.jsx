import { useMantineTheme, Title, Text, Card, Button, Group, Progress  } from '@mantine/core';
import { useTimer } from '../../hooks/timer.js';
import CircleProgress from '../../components/circleProgress.jsx';
import { useEffect } from 'react';

const Exercise = ( {exercise} ) => {
	const { title, sets, setsEnd, reps, timeAmount } = exercise;
	const isTimeExercise = !!timeAmount;

	const { time, isRunning, isFinished, start, pause, reset } = isTimeExercise ? useTimer(timeAmount) : {};
	useEffect(() => {
		if (isTimeExercise && timeAmount > 0) {
			start();
		}
	}, [isTimeExercise, timeAmount, start]);

	const theme = useMantineTheme();
	const ringColor = theme.colors.myColor[7]; 

	const elements = Array.from({ length: sets }, (_, i) => {
    const isActive = i < setsEnd;

    return (
     <Progress key={i} size="xs" transitionDuration={0} value={isActive ? 100 : 0} />
    );
  });
	
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
			<Title order={1} ta="center" mb="md">
				{title}
			</Title>

			<Card.Section withBorder>
				{
					isTimeExercise ? 
						<CircleProgress time={time} maxTime={timeAmount} isFinished={isFinished} color={ringColor}/>

						// 	<Group justify="center" mb="md">
						// 		{!isRunning && <Button variant="light" onClick={start}>
						// 			{time > 0 ? "CONTINUE" : "START"}
						// 		</Button>}
						// 		{isRunning && <Button variant="light" onClick={pause}>PAUSE</Button>}
						// 		{/* {time !== 0 && <Button variant="light" onClick={reset}>RESET</Button>} */}
						// 	</Group>
					:
					<>
						<CircleProgress color={ringColor}/>
						<Group justify="center" mb="md" mt="md">
							<Button variant="light">SET IS DONE</Button>
						</Group>
					</>
				}
				
				<Group grow gap={5} mb="md">
					{elements}
				</Group>
			</Card.Section>

			<Text ta="center" mt="md" size="md" c="dimmed">
				{title}
			</Text>
		</Card>
  );
};

export default Exercise;