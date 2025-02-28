import { useEffect } from 'react';
import { Title, SimpleGrid, Button, Group, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores.jsx';
import ExerciseCard from '../components/ExerciseCard/index.jsx';
import { MultiSelectAsync } from '../components/MultiSelectAsync.jsx';
import { filterNames, groupNames } from '../stores/ExerciseStore.js';
import { useAuth } from '../stores/context/AuthContext.jsx';
import { useTranslation } from 'react-i18next';

const Exercises = observer(() => {
  const { t } = useTranslation();
	const { currentUser } = useAuth();
  const { ExerciseStore, ExerciseFilterStore } = useStores();

  const filterBodyLoad = async (filterName) => {
    await ExerciseFilterStore.loadFilter(filterName);
    return ExerciseFilterStore[filterName];
  };

  const filterSelectHandler = (name, values) => {
    ExerciseStore.setFilters(name, values);
  };

  useEffect(() => {
    ExerciseStore.loadExercises();
  }, [ExerciseStore.allExercises]);
  
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
          <Title order={1}>{t('exercises.pageTitle')}</Title>
          {
            !!currentUser &&
            <Group justify='space-between' gap="xs">
              <Group gap="xs">
                <Button
                  variant={ExerciseStore.groupExercise === groupNames.ALL ? 'filled' : 'outline'}
                  onClick={() => ExerciseStore.setGroupExercise(groupNames.ALL)}
                >
                  {t('exercises.all')}
                </Button>
                <Button
                  variant={ExerciseStore.groupExercise === groupNames.BOOKMARKS ? 'filled' : 'outline'}
                  onClick={() => ExerciseStore.setGroupExercise(groupNames.BOOKMARKS)}
                >
                  {t('exercises.favorites')}
                </Button>
                <Button
                  variant={ExerciseStore.groupExercise === groupNames.PERSONAL ? 'filled' : 'outline'}
                  onClick={() => ExerciseStore.setGroupExercise(groupNames.PERSONAL)}
                >
                  {t('exercises.selfCreated')}
                </Button>

              </Group>
              {ExerciseStore.groupExercise === groupNames.ALL && 
                <Group gap="xs">
                  <MultiSelectAsync
                    title={t('exercises.equipment')}
                    translateKey="filters.equipment."
                    selectedValue={ExerciseStore.filters[filterNames.EQUIPMENT]}
                    onFirstOpen={() => filterBodyLoad(filterNames.EQUIPMENT)}
                    onSelect={(value) => filterSelectHandler(filterNames.EQUIPMENT, value)}
                    // disabled={!!ExerciseStore.filters.values && ExerciseStore.filters.name != filterNames.EQUIPMENT}
                  />
                  <MultiSelectAsync
                    title={t('exercises.bodyParts')}
                    translateKey="filters.bodyPart."
                    selectedValue={ExerciseStore.filters[filterNames.BODYPART]}
                    onFirstOpen={() => filterBodyLoad(filterNames.BODYPART)}
                    onSelect={(value) => filterSelectHandler(filterNames.BODYPART, value)}
                    // disabled={!!ExerciseStore.filters.values && ExerciseStore.filters.name != filterNames.BODYPART}
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