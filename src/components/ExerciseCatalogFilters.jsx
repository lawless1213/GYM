import { Group, Button } from '@mantine/core';
import { MultiSelectAsync } from './MultiSelectAsync.jsx';
import { useTranslation } from 'react-i18next';
import { filterNames, groupNames } from '../services/exerciseService.js';

export function ExerciseCatalogFilters({
  groupExercise,
  setGroupExercise,
  filters,
  handleFilterChange,
  filterOptions,
  currentUser,
  showGroupButtons = true
}) {
  const { t } = useTranslation();

  return (
    <Group gap="xs">
      {showGroupButtons && currentUser && (
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
      )}

      {(groupExercise === groupNames.ALL || !showGroupButtons) && (
        <Group gap="xs">
          <MultiSelectAsync
            title={t('exercises.equipment')}
            translateKey="filters.equipment."
            selectedValue={filters[filterNames.EQUIPMENT]}
            data={filterOptions.equipment.data}
            loading={filterOptions.equipment.loading}
            onSelect={(value) => handleFilterChange(filterNames.EQUIPMENT, value)}
          />
          <MultiSelectAsync
            title={t('exercises.bodyParts')}
            translateKey="filters.bodyPart."
            selectedValue={filters[filterNames.BODYPART]}
            data={filterOptions.bodyPart.data}
            loading={filterOptions.bodyPart.loading}
            onSelect={(value) => handleFilterChange(filterNames.BODYPART, value)}
          />
        </Group>
      )}
    </Group>
  );
}