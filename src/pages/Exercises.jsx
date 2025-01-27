import { useEffect } from 'react';
import { Title, SimpleGrid, Button, Group, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores.jsx';
import ExerciseCard from '../components/ExerciseCard/index.jsx';
import { SelectAsync } from '../components/SelectAsync.jsx';
import ProtectedRoute from '../systemComponents/ProtectedRoute.jsx';


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
      id={item.id}
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
        <Stack style={{ width: "100%" }}>
          <Title order={1}>Exercise Library</Title>
          <Group justify='space-between' gap="xs">
            <Group gap="xs">
              <Button
                variant={!ExerciseStore.isBookmarks ? 'filled' : 'outline'}
                onClick={() => ExerciseStore.setIsBookmarks(false)}
              >
                All
              </Button>
              <ProtectedRoute key={navItem.label}>
                <Button
                  variant={ExerciseStore.isBookmarks ? 'filled' : 'outline'}
                  onClick={() => ExerciseStore.setIsBookmarks(true)}
                >
                  Favorites
                </Button>
              </ProtectedRoute>
              
              <ProtectedRoute key={navItem.label}>
                <Button
                  variant={ExerciseStore.isBookmarks ? 'filled' : 'outline'}
                  onClick={() => ExerciseStore.setIsBookmarks(true)}
                >
                  My
                </Button>
              </ProtectedRoute>
            </Group>
            { !ExerciseStore.isBookmarks &&
              <Group gap="xs">
                <SelectAsync
                  title="Body part"
                  selectedValue={ExerciseStore.filters['bodyPart']}
                  onFirstOpen={() => filterBodyLoad('bodyPart')}
                  onSelect={(value) => filterSelectHandler('bodyPart', value)}
                />
                <SelectAsync
                  title="Equipment"
                  selectedValue={ExerciseStore.filters['equipment']}
                  onFirstOpen={() => filterBodyLoad('equipment')}
                  onSelect={(value) => filterSelectHandler('equipment', value)}
                />
              </Group> 
            }
          </Group>
        </Stack>
      </Group>
      <SimpleGrid cols={{ base: 1, xs: 2, lg: 3, xl: 4 }}>{cards}</SimpleGrid>
    </>
  );
});

export default Exercises;