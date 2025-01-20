import { useEffect } from 'react';
import { Title, SimpleGrid, Button, Group, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores.jsx';
import ExerciseCard from '../components/ExerciseCard/index.jsx';
import { SelectAsync } from '../components/SelectAsync.jsx';

const Exercises = observer(() => {
  const { ExerciseStore, ExerciseFilterStore } = useStores();

  const filterBodyLoad = async (filterName) => {
    await ExerciseFilterStore.loadFilter(filterName);
    return ExerciseFilterStore[filterName];
  };

  const filterSelectHandler = (name, value) => {
    ExerciseStore.setFilters(name, value);
  };

  useEffect(() => {
    ExerciseStore.loadItems();
  }, [ExerciseStore]);

  const cards = (ExerciseStore.isBookmarks ? ExerciseStore.bookmarks : ExerciseStore.allExercises).map((item) => (
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
              variant={!ExerciseStore.isBookmarks ? 'filled' : 'outline'}
              onClick={() => ExerciseStore.setIsBookmarks(false)}
            >
              All
            </Button>
            <Button
              variant={ExerciseStore.isBookmarks ? 'filled' : 'outline'}
              onClick={() => ExerciseStore.setIsBookmarks(true)}
            >
              Favorites
            </Button>
            <SelectAsync
              title="Body part"
              onFirstOpen={() => filterBodyLoad('bodyPart')}
              onSelect={(value) => filterSelectHandler('bodyPart', value)}
            />
            <SelectAsync
              title="Equipment"
              onFirstOpen={() => filterBodyLoad('equipment')}
              onSelect={(value) => filterSelectHandler('equipment', value)}
            />
          </Group>
        </Stack>
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>{cards}</SimpleGrid>
    </>
  );
});

export default Exercises;