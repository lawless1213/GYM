import { Group, Card, Title, Text, Image, Badge } from '@mantine/core';
import s from './index.module.scss';

const ExerciseCard = ({name, equipment, bodyPart, preview}) => {

	return (
		<Card
			shadow="sm"
      padding="sm"
		>
			<Group gap="sm">
				<Badge>{equipment}</Badge>
				<Badge variant="light">{bodyPart}</Badge>
			</Group>
			<Card.Section >
				<Image
					mt="md"
					mb="md"
					height="160px"
					fit="contain" 
					src={preview} alt={name} 
				/>
      </Card.Section>
			<Title ta="center" order={3}>
				{name}
			</Title>
		</Card>
	)
} 

export default ExerciseCard;