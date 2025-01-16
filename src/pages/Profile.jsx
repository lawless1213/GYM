import { Title } from '@mantine/core';
import { useAuth } from '../stores/context/AuthContext';

const Profile = () => {
	const { currentUser } = useAuth();
	
	return (
		<>
			<Title order={1}>Hi, {currentUser.displayName}</Title>
			<Title order={4}>{currentUser.email}</Title>
		</>
	)
} 

export default Profile;