import { useMantineTheme, RingProgress, Text } from '@mantine/core';

const CircleProgress = ({ time, maxTime, isFinished, color='blue' }) => {
	
	
  return (
    <RingProgress
			sections={[{ 
				value: (time / maxTime) * 100,
				color: color 
			}]}
			ml="auto"
			mr="auto"
			mb="md"
			mt="md"
			roundCaps
			transitionDuration={1000}
			label={
				<Text c={color} fw={700} ta="center" size="xl">
					{isFinished ? 'DONE' : time}
				</Text>
			}
		/>
  );
};

export default CircleProgress;