import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import Workout from './Workout';
import { AppShell } from '@mantine/core';
import { Container } from '@mantine/core';


const PageLayout = () => {
	
	return (
		// <main className="main">
		// 	gh
		// 	
		// </main>

		// <AppShell
		// 	padding="md"
		// 	className="main"
		// >
		// 	<AppShell.Main>
		// 		
		// 	</AppShell.Main>
		// </AppShell>
		
		<Container className='main' fluid mt='md' mb='md'>
			<Routes>
				<Route path='/' element={<Home/>}></Route>
				<Route path='/workout' element={<Workout/>}></Route>
			</Routes>
		</Container>
	)
}

export default PageLayout;