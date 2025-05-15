import { Title, Stack, Group } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useExerciseCatalog } from '../hooks/useExerciseCatalog.js';
import { ExerciseCatalogFilters } from '../components/ExerciseCatalogFilters.jsx';
import { ExerciseCatalogDisplay } from '../components/ExerciseCatalogDisplay.jsx';

const Exercises = observer(() => {
  const { t } = useTranslation();
  const { exercises, loading, groupExercise, setGroupExercise, filters, handleFilterChange, filterOptions, currentUser } = useExerciseCatalog();

  return (
    <>
      <Group mb="md">
        <Stack style={{ width: "100%" }}>
          <Title order={1}>{t('exercises.pageTitle')}</Title>
          <ExerciseCatalogFilters
            groupExercise={groupExercise}
            setGroupExercise={setGroupExercise}
            filters={filters}
            handleFilterChange={handleFilterChange}
            filterOptions={filterOptions}
            currentUser={currentUser}
            showGroupButtons={true} // Показуємо кнопки групування
          />
        </Stack>
      </Group>
      <ExerciseCatalogDisplay
        exercises={exercises}
        loading={loading}
        simpleCards={false} // Звичайні картки
      />
    </>
  );
});

export default Exercises;