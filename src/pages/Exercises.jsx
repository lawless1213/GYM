import { useEffect } from 'react';
import { Title, SimpleGrid, Button, Group, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores.jsx';
import ExerciseCard from '../components/ExerciseCard/index.jsx';
import { SelectAsync } from '../components/SelectAsync.jsx';
import { groupNames } from '../stores/ExerciseStore.js';
import { useAuth } from '../stores/context/AuthContext.jsx';


const Exercises = observer(() => {
	const { currentUser } = useAuth();
  const { ExerciseStore, ExerciseFilterStore } = useStores();

  const filterBodyLoad = async (filterName) => {
    await ExerciseFilterStore.loadFilter(filterName);
    return ExerciseFilterStore[filterName];
  };

  const filterSelectHandler = (name, value) => {
    ExerciseStore.setFilters(name, value);
  };

  useEffect(() => {
    ExerciseStore.loadExercises();
  }, [ExerciseStore.groupExercise]);
  
  const cards = (ExerciseStore.allExercises[ExerciseStore.groupExercise]).map((item) => (
    <ExerciseCard
      key={item.id}
      id={item.id}
      name={item.name}
      description={item.description}
      preview={item.preview}
      video={item.video}
      equipment={item.equipment}
      bodyPart={item.bodyPart}
      authorName={item.authorName}
      author={item.author}
    />
  ));
  
  return (
    <>
      
      <Group position="apart" mb="md">
        <Stack style={{ width: "100%" }}>
          <Title order={1}>Exercise Library</Title>
          {
            !!currentUser &&
            <Group justify='space-between' gap="xs">
              <Group gap="xs">
                <Button
                  variant={ExerciseStore.groupExercise === groupNames.ALL ? 'filled' : 'outline'}
                  onClick={() => ExerciseStore.setGroupExercise(groupNames.ALL)}
                >
                  All
                </Button>
                <Button
                  variant={ExerciseStore.groupExercise === groupNames.BOOKMARKS ? 'filled' : 'outline'}
                  onClick={() => ExerciseStore.setGroupExercise(groupNames.BOOKMARKS)}
                >
                  Favorites
                </Button>
                <Button
                  variant={ExerciseStore.groupExercise === groupNames.PERSONAL ? 'filled' : 'outline'}
                  onClick={() => ExerciseStore.setGroupExercise(groupNames.PERSONAL)}
                >
                  Self created
                </Button>

              </Group>
              {ExerciseStore.groupExercise === groupNames.ALL && 
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
          }
        </Stack>
      </Group>
      <SimpleGrid cols={{ base: 1, xs: 2, lg: 3, xl: 4 }}>{cards}</SimpleGrid>
    </>
  );
});

export default Exercises;