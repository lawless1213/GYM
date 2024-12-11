import { Route, Routes } from 'react-router-dom';
import Home from './Home';

const PageLayout = () => {
	
	return (
		<main className="main">
			<Routes>
				<Route path='/' element={<Home/>}></Route>
      </Routes>
		</main>
	)
}

export default PageLayout;