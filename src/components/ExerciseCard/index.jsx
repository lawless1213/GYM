import { Group, Card, Title, Badge, Loader } from '@mantine/core';

import s from './index.module.scss';
import { useState } from 'react';

const ExerciseCard = ({name, equipment, bodyPart, preview, video}) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLoadingImg, setIsLoadingImg] = useState(true);

	const handleImageLoad = () => {
    setIsLoadingImg(false);
  };

	const handleMouseOver = (event) => {
    const video = event.currentTarget.querySelector("video");
		if (video && video.paused && !isPlaying) {
			video.playbackRate = 2; 
			video.play();
			setIsPlaying(true);
		}
  };

  const handleMouseOut = (event) => {
    const video = event.currentTarget.querySelector("video");
    if (video && isPlaying) {
			video.pause();
			setIsPlaying(false);
			video.currentTime = 0;
		}
  };


	return (
		<>
			<Card
				shadow="sm"
				padding="md"
				className={s.Card}
				onMouseOver={handleMouseOver} 
				onMouseOut={handleMouseOut}
			>
				<Group gap="sm">
					<Badge>{equipment}</Badge>
					<Badge variant="light">{bodyPart}</Badge>
				</Group>
				<Card.Section
					className={s.Preview} 
					mt="md"
					mb="md"
				>
					{isLoadingImg && (
						<Loader/>
					)}
					<video width="100%" src={video} muted loop onLoad={handleImageLoad}>
						Your browser does not support the video tag.
					</video>
				</Card.Section>
				<Title ta="center" order={3}>
					{name}
				</Title>
			</Card>
		</>
	)
} 

export default ExerciseCard;