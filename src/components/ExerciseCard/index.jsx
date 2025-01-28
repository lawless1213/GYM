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

import s from './index.module.scss';

const ExerciseCard = observer(({id, name, equipment, bodyPart, preview, video, authorName}) => {
	const { SettingStore, ExerciseStore } = useStores();
	const [isVideoPreview, setIsVideoPreview] = useState(SettingStore.isVideoPreview);

	const bookmarkToggler = () => {
		ExerciseStore.toggleBookmark(id);
	} 

	const isFavorite = ExerciseStore.isFavorite(id);

	const previewToggleHandler = () => {
    setIsVideoPreview(!isVideoPreview);
  };

	return (
		<>
			<Card
				shadow="sm"
				padding="md"
				className={s.Card}
			>
				<Group gap="xs" justify='space-between'>
					<Stack gap="xs">
						<Badge>{equipment}</Badge>
						<Badge variant="light">{bodyPart}</Badge>
					</Stack>
					<Group gap="xs">
						<ActionIcon onClick={previewToggleHandler} variant="default" aria-label="Settings">
							{isVideoPreview ? <IconVideoOff /> : <IconVideo />}
						</ActionIcon>
						<ActionIcon onClick={bookmarkToggler} variant="default" aria-label="Bookmark">
							{isFavorite ? <IconBookmarkFilled /> : <IconBookmark />}
						</ActionIcon>
						<Menu position="bottom-end" shadow="md" width={200}>
							<Menu.Target>
								<ActionIcon variant="default" aria-label="Settings">
									<IconDotsVertical/>
								</ActionIcon>
							</Menu.Target>

							<Menu.Dropdown>
								<Menu.Label>{name}</Menu.Label>
								<Menu.Item leftSection={<IconEdit  size={14} />}>
									Edit
								</Menu.Item>

								<Menu.Divider />

								<Menu.Item
									color="red"
									leftSection={<IconTrash size={14} />}
								>
									Delete
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					</Group>
					
				</Group>
				<Card.Section
					className={s.Preview} 
					mt="md"
					mb="md"
				>
					{
						isVideoPreview ? 
							<video width="100%" src={video} autoPlay muted loop>
								Your browser does not support the video tag.
							</video>
						:
							<Image
								h={160}
								fit="contain"
								src={preview}
							/>
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