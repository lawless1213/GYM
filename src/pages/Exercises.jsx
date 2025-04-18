import { useEffect, useState } from 'react';
import { Title, SimpleGrid, Button, Group, Stack, Loader, Flex } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores.jsx';
import ExerciseCard from '../components/ExerciseCard/index.jsx';
import { MultiSelectAsync } from '../components/MultiSelectAsync.jsx';
import { filterNames, groupNames } from '../services/exerciseService.js';
import { useAuth } from '../stores/context/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import { useQuery } from "@apollo/client";
import { useExercises } from '../hooks/useExercises.js';
import { GET_FILTERS } from '../queries/filters.js';

const Exercises = observer(() => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [groupExercise, setGroupExercise] = useState(groupNames.ALL);
  const [filters, setFilters] = useState({});

  const { data: filterBodyPartsData, loading: loadingBodyParts } = useQuery(GET_FILTERS, { variables: { name: "bodyPart" } });
  const { data: filterEquipmentData, loading: loadingEquipment } = useQuery(GET_FILTERS, { variables: { name: "equipment" } });

  const { exercises, loading, error } = useExercises(groupExercise, filters, currentUser);

  const handleFilterChange = (name, values) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (!values.length) {
        delete updatedFilters[name];
      } else {
        updatedFilters[name] = values;
      }

      return updatedFilters;
    });
  };

  const cards = exercises.map((item) => (
    <ExerciseCard
      key={item.id}
      exercise={item}
    />
  ));

  return (
    <>
      <Group position="apart" mb="md">
        <Stack style={{ width: "100%" }}>
          <Title order={1}>{t('exercises.pageTitle')}</Title>
          {currentUser && (
            <Group justify='space-between' gap="xs">
              <Group gap="xs">
                <Button
                  variant={groupExercise === groupNames.ALL ? 'filled' : 'outline'}
                  onClick={() => setGroupExercise(groupNames.ALL)}
                >
                  {t('exercises.all')}
                </Button>
                <Button
                  variant={groupExercise === groupNames.BOOKMARKS ? 'filled' : 'outline'}
                  onClick={() => setGroupExercise(groupNames.BOOKMARKS)}
                >
                  {t('exercises.favorites')}
                </Button>
                <Button
                  variant={groupExercise === groupNames.PERSONAL ? 'filled' : 'outline'}
                  onClick={() => setGroupExercise(groupNames.PERSONAL)}
                >
                  {t('exercises.selfCreated')}
                </Button>
              </Group>
              {groupExercise === groupNames.ALL && (
                <Group gap="xs">
                  <MultiSelectAsync
                    title={t('exercises.equipment')}
                    translateKey="filters.equipment."
                    selectedValue={filters[filterNames.EQUIPMENT]}
                    data={filterEquipmentData?.getFilters.values || []}
                    loading={loadingEquipment}
                    onSelect={(value) => handleFilterChange(filterNames.EQUIPMENT, value)}
                  />
                  <MultiSelectAsync
                    title={t('exercises.bodyParts')}
                    translateKey="filters.bodyPart."
                    selectedValue={filters[filterNames.BODYPART]}
                    data={filterBodyPartsData?.getFilters.values || []}
                    loading={loadingBodyParts}
                    onSelect={(value) => handleFilterChange(filterNames.BODYPART, value)}
                  />
                </Group>
              )}
            </Group>
          )}
        </Stack>
      </Group>
      {
        loading && 
        <Flex flex={1} justify='center' align='center'>
          <Loader />
        </Flex>
      }
      {
        !loading && !cards.length ? (
          <Flex flex={1} justify='center' align='center'>
            <Title order={3}>Nothing found..</Title>
          </Flex>
        ) : (
          <SimpleGrid cols={{ base: 1, xs: 2, lg: 3, xl: 4 }}>{cards}</SimpleGrid>
        )
      }
    </>
  );
});

export default Exercises;