import { useState, useEffect } from 'react';
import { Title, SimpleGrid, Button, Group, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores.jsx';
import ExerciseCard from '../components/ExerciseCard/index.jsx';
import { SelectAsync } from '../components/SelectAsync.jsx';

const Exercises = observer(() => {
  const { ExerciseStore } = useStores();
  const { ExerciseFilterStore } = useStores();
  const [ isBookmarks, setIsBookmarks ] = useState(false);

	const filterBodyLoad = async (filterName) => {
    await ExerciseFilterStore.loadFilter(filterName);
    return ExerciseFilterStore[filterName];
  };

  useEffect(() => {
    if (isBookmarks) {
      ExerciseStore.loadBookmarks();
    } else {
      ExerciseStore.loadAllExercises();
    }
  }, [isBookmarks, ExerciseStore]);

  const cards = (isBookmarks ? ExerciseStore.bookmarks : ExerciseStore.allExercises).map((item) => (
    <ExerciseCard
      key={item.id}
      name={item.name}
      preview={item.preview}
      video={item.video}
      equipment={item.equipment}
      bodyPart={item.bodyPart}
    />
  ));

  return (
    <>
      <Group position="apart" mb="md">
				<Stack>
					<Title order={1}>Exercise Library</Title>
					<Group>
						<Button
							variant={!isBookmarks ? 'filled' : 'outline'}
							onClick={() => setIsBookmarks(false)}
						>
							All
						</Button>
						<Button
							variant={isBookmarks ? 'filled' : 'outline'}
							onClick={() => setIsBookmarks(true)}
						>
							Favorites
						</Button>
						<SelectAsync title='Body part' callback={() => filterBodyLoad('bodyPart')} />
						<SelectAsync title='Equipment' callback={() => filterBodyLoad('equipment')} />
					</Group>
				</Stack>
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        {cards}
      </SimpleGrid>
    </>
  );
});

export default Exercises;
