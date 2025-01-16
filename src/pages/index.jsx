import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import Workout from './Workout';
import Exercises from './Exercises';
import Settings from './Settings';
import Profile from './Profile';
import { Container } from '@mantine/core';


const PageLayout = () => {
	
	return (
		<Container className='main' fluid mt='md' mb='md'>
			<Routes>
				<Route path='/' element={<Home/>}></Route>
				<Route path='/exercises' element={<Exercises/>}></Route>
				<Route path='/workout' element={<Workout/>}></Route>
				<Route path='/profile' element={<Profile/>}></Route>
				<Route path='/settings' element={<Settings/>}></Route>
			</Routes>
		</Container>
	)
}

export default PageLayout;