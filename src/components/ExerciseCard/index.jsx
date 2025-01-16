import { useState } from 'react';
import { Group, Card, Title, Badge, Loader, Image, ActionIcon, Menu, Button, Text } from '@mantine/core';
import { IconVideo, IconVideoOff } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import {
  IconBookmark ,
  IconEdit,
  IconTrash,
  IconDotsVertical ,
} from '@tabler/icons-react';
import { useStores } from '../../hooks/useStores';

import s from './index.module.scss';

const ExerciseCard = observer(({name, equipment, bodyPart, preview, video}) => {
	const { SettingStore } = useStores();
	const [isVideoPreview, setIsVideoPreview] = useState(SettingStore.isVideoPreview);

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
				<Group gap="sm">
					<Badge>{equipment}</Badge>
					<Badge variant="light">{bodyPart}</Badge>
					<ActionIcon onClick={previewToggleHandler} ml="auto" variant="default" aria-label="Settings">
						{isVideoPreview ? <IconVideoOff /> : <IconVideo />}
					</ActionIcon>
					<Menu position="bottom-end" shadow="md" width={200}>
						<Menu.Target>
							<ActionIcon variant="default" aria-label="Settings">
								<IconDotsVertical/>
							</ActionIcon>
						</Menu.Target>

						<Menu.Dropdown>
							<Menu.Label>{name}</Menu.Label>
							<Menu.Item leftSection={<IconBookmark size={14} />}>
								Add to favorite
							</Menu.Item>
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
			</Card>
		</>
	)
})

export default ExerciseCard;