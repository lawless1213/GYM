import { useState, useMemo } from 'react';
import { Group, Card, Title, Badge, Loader, Image, ActionIcon, Menu, Button, Text, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import {
	IconVideo,
	IconVideoOff,
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconHeart,
  IconHeartFilled,
} from '@tabler/icons-react';
import { useStores } from '../../hooks/useStores';
import { useAuth } from '../../stores/context/AuthContext';
import { modals } from '@mantine/modals';
import { useTranslation } from 'react-i18next';
import exerciseService from '../../services/exerciseService';
import { useNavigate } from 'react-router-dom';

import s from './index.module.scss';

const ExerciseCard = observer(({exercise}) => {
	const { t } = useTranslation();
	const { currentUser } = useAuth();
	const { SettingStore, ExerciseStore } = useStores();
	const [isVideoPreview, setIsVideoPreview] = useState(SettingStore.isVideoPreview);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);	

	const {
		id,
		name,
		description,
		equipment,
		bodyPart,
		preview,
		video,
		authorName,
		author,
		isBookmarked,
		createdAt,
		type,
		valuePerSet,
		caloriesPerSet,
	} = exercise;

	const formattedDate = useMemo(() => {
		if (!createdAt) return '';
		return new Date(createdAt).toLocaleDateString('uk-UA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}, [createdAt]);

	const bookmarkToggler = async () => {
		if (!currentUser) return;
		
		setLoading(true);
		try {
			await exerciseService.toggleBookmark(id);
		} catch (error) {
			console.error('Error toggling bookmark:', error);
		} finally {
			setLoading(false);
		}
	} 

	const handleDeleteExercise  = async () => {
		const result = await exerciseService.deleteExercise({id, author, video, preview});
		console.log("Mutation result:", result);
	};

	const previewToggleHandler = () => {
    setIsVideoPreview(!isVideoPreview);
  };

	const editHandler = () => {
		modals.openContextModal({
			modal: 'exercise',
			title: "Update your exercise",
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
						{
							Array.isArray(equipment) && 
							<Group gap="xs">
								{
									equipment.map( el => (
										<Badge key={el}>{t(`filters.equipment.${el}`)}</Badge>
									))
								}
							</Group>
						}

						{
							Array.isArray(bodyPart) && 
							<Group gap="xs">
								{
									bodyPart.map( el => (
										<Badge variant="light" key={el}>{t(`filters.bodyPart.${el}`)}</Badge>
									))
								}
							</Group>
						}
					</Stack>
					<Group gap="xs">
						{
							!!currentUser &&  
							<ActionIcon onClick={bookmarkToggler} variant="default" aria-label="Bookmark" loading={loading} disabled={loading}>
								{isBookmarked ? <IconHeartFilled /> : <IconHeart />}
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
										onClick={() => modals.openConfirmModal({
											title: t('exercise.delete.title'),
											children: t('exercise.delete.description'),
											labels: { confirm: t('exercise.delete.confirm'), cancel: t('exercise.delete.cancel') },
											confirmProps: { color: 'red' },
											onConfirm: () => handleDeleteExercise()
										})}
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
				<Stack gap="xs" mt="md">
					<Title order={3} style={{ margin: 0 }}>{name}</Title>
					<Text size="sm">{description}</Text>
					<Text size="sm" c="dimmed">{valuePerSet}{t(`exercise.${type}.per.set`)}</Text>
					<Group>
						<Text size="sm" c="dimmed">{formattedDate}</Text>
						<Text ml='auto' size="sm" c="dimmed">{authorName}</Text>
					</Group>
				</Stack>
			</Card>
		</>
	)
})

export default ExerciseCard;