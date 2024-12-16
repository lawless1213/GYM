import { useState, useEffect } from 'react';
import { Title } from '@mantine/core';
import { workoutPlan } from '../data/workoutPlan.js';

import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button } from '@mantine/core';

import { ActionIcon, RingProgress, Text, Center, rem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useTimer } from '../hooks/timer.js';

const Workout = () => {
	const [opened, { open, close }] = useDisclosure(false);
	const [progress, setProgress] = useState(0);
	const { time, isRunning, start, pause, reset } = useTimer();

	// const [dayOfWeek, setDayOfWeek] = useState(0);
	
  // useEffect(() => {
	// 	const today = new Date();
	// 	setDayOfWeek(today.getDay());
	// }, []);

	// const {day, name} = workoutPlan[dayOfWeek];

	return (
		<>
			{/* <Title order={1}>It`s {day}, today we will work on {name}</Title> */}
			<Drawer 
				opened={opened} 
				onClose={close}
				position="bottom" 
				size="95%"
				overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
				radius='md'
				transitionProps={{ transition: 'fade-up', duration: 150, timingFunction: 'linear' }}
				// withCloseButton={false}
				closeOnClickOutside={false}
			>
				<RingProgress
					sections={[{ value: time, color: 'blue' }]}
					transitionDuration={1000}
					label={
						<Text c="blue" fw={700} ta="center" size="xl">
							{time}
						</Text>
					}
				/>

				<h2>{time}</h2>
				<div>
					{!isRunning && <button onClick={start}>Start</button>}
					{isRunning && <button onClick={pause}>Pause</button>}
					<button onClick={reset}>Reset</button>
				</div>
      </Drawer>

			<Button variant="default" onClick={open}>
				START
      </Button>
		</>
	)
} 

export default Workout;