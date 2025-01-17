import { useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button, Text, Title } from '@mantine/core';
import Exercise from '../sections/Exercise';
import Rest from '../sections/Rest';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores.jsx';

const Workout = observer(() => {
	const [opened, { open, close }] = useDisclosure(false);
	const { WorkoutStore } = useStores();
	
	return (
		<>
			{/* <Title order={1}>Сьогоднішнє тренування на {WorkoutStore.todayWorkout.name}</Title> */}
			<Text size="xl">
				День: {WorkoutStore.dayOfWeek}
			</Text>
      <Title order={1}>Вправи:</Title>
			<Title order={2}>
				<ul>
					{WorkoutStore.todayWorkout.exercises.map((exercise, index) => (
						<li key={index}>
							{exercise.title} - {exercise.sets} підходів, {exercise.reps || exercise.timeAmount} повторень
						</li>
					))}
      </ul>
			</Title>
			<Button variant="default" onClick={open}>OPEN</Button>

			<Drawer 
				opened={opened} 
				onClose={close}
				position="bottom" 
				size="95%"
				overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
				radius='md'
				transitionProps={{ transition: 'fade-up', duration: 150, timingFunction: 'linear' }}
				withCloseButton={false}
				closeOnClickOutside={false}
			>
				<Exercise exercise={WorkoutStore.currentExercise}/>
				{/* <Rest/> */}
				<Button variant="default" onClick={close}>Exit workout</Button>
      </Drawer>
			
		</>
	)
}) 

export default Workout;