import { useState, useEffect } from 'react';
import { workoutPlan } from '../data/workoutPlan.js';
import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button } from '@mantine/core';
import Exercise from '../sections/Exercise';
import Rest from '../sections/Rest';

const Workout = () => {
	const [opened, { open, close }] = useDisclosure(false);

	const [dayOfWeek, setDayOfWeek] = useState(0);
  useEffect(() => {
		const today = new Date();
		setDayOfWeek(today.getDay());
	}, []);
	const {day, name, exercises} = workoutPlan[dayOfWeek];

	return (
		<>
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
				{/* <Exercise title='TITLE'/> */}
				<Rest/>
      </Drawer>

			<Button variant="default" onClick={open}>OPEN</Button>
		</>
	)
} 

export default Workout;