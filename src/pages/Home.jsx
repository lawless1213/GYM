import { useFullscreen } from '@mantine/hooks';
import { Button } from '@mantine/core';

const Home = () => {
  const { toggle, fullscreen } = useFullscreen();

	return (
		<>
			<Button onClick={toggle} color={fullscreen ? 'red' : 'blue'}>
        {fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      </Button>
		</>
	)
} 

export default Home;