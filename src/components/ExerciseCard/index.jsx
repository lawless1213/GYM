import { useState } from 'react';
import { Group, Card, Title, Badge, Loader, Image, ActionIcon, Menu, Button, Text, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import {
	IconVideo,
	IconVideoOff,
  IconBookmark,
	IconBookmarkFilled,
  IconEdit,
  IconTrash,
  IconDotsVertical ,
} from '@tabler/icons-react';
import { useStores } from '../../hooks/useStores';
import { useAuth } from '../../stores/context/AuthContext';
import { modals } from '@mantine/modals';
import { useTranslation } from 'react-i18next';


import s from './index.module.scss';

const ExerciseCard = observer(({id, name, description, equipment, bodyPart, preview, video, authorName, author}) => {
  const { t } = useTranslation();
	const { currentUser } = useAuth();
	const { SettingStore, ExerciseStore } = useStores();
	const [isVideoPreview, setIsVideoPreview] = useState(SettingStore.isVideoPreview);

	const bookmarkToggler = () => {
		ExerciseStore.toggleBookmark(id);
	} 

	const deleteHandler = () => {
		ExerciseStore.deleteExercise({id, author, video, preview});
	}

	const isFavorite = ExerciseStore.isFavorite(id);

	const previewToggleHandler = () => {
    setIsVideoPreview(!isVideoPreview);
  };

	const editHandler = () => {
		modals.openContextModal({
			modal: 'create',
			title: <Title order={2}>Update your exercise</Title>,
			size: 'xl',
			innerProps: {
				exercise: {id, name, description, equipment, bodyPart, preview, video}
			}
		})		
	}

	return (
		<>
			<Card
				shadow="sm"
				padding="md"
				className={s.Card}
			>
				<Group gap="xs" justify='space-between'>
					<Stack gap="xs">
						<Badge>{t(`filters.equipment.${equipment}`)}</Badge>
						<Badge variant="light">{t(`filters.bodyPart.${bodyPart}`)}</Badge>
					</Stack>
					<Group gap="xs">
						{
							!!currentUser &&  
							<ActionIcon onClick={bookmarkToggler} variant="default" aria-label="Bookmark">
								{isFavorite ? <IconBookmarkFilled /> : <IconBookmark />}
							</ActionIcon>
						}
						
						{
							!!currentUser && author === currentUser.uid &&
							<Menu position="bottom-end" shadow="md" width={200}>
								<Menu.Target>
									<ActionIcon variant="default" aria-label="Settings">
										<IconDotsVertical/>
									</ActionIcon>
								</Menu.Target>

								<Menu.Dropdown>
									<Menu.Item 
										leftSection={<IconEdit size={14} />}
										onClick={editHandler}
									>
										{t(`exercise.edit`)}
									</Menu.Item>

									<Menu.Divider />

									<Menu.Item
										color="red"
										leftSection={<IconTrash size={14} />}
										onClick={deleteHandler}
									>
										{t(`exercise.delete`)}
									</Menu.Item>
								</Menu.Dropdown>
							</Menu>
						}
						
					</Group>
					
				</Group>
				<Card.Section
					className={s.Preview} 
					mt="md"
					mb="md"
					style={{position: "relative"}}
				>
					{
						isVideoPreview ? 
							(!!video && <video width="100%" src={video} autoPlay muted loop>
								Your browser does not support the video tag.
							</video>)
						:
							(!!preview && <Image
								h={160}
								fit="contain"
								src={preview}
							/>)
					}
					{!!video && 
					<ActionIcon 
						onClick={previewToggleHandler} 
						variant="default" 
						aria-label="Settings"
						mb="xs" 
						mr="xs" 
						style={{position: "absolute", bottom: "0", right: "0", zIndex: "1"}}
					>
						{isVideoPreview ? <IconVideoOff /> : <IconVideo />}
					</ActionIcon>
					}
				</Card.Section>
				<Title ta="center" order={3}>
					{name}
				</Title>
				<Title ta="center" order={6}>
					{authorName}
				</Title>
			</Card>
		</>
	)
})

export default ExerciseCard;