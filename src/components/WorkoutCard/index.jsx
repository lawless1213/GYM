import { useState, useRef, memo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import  workoutService  from '../../services/workoutService';

import {
  Card, Title, Text, Group, Stack,
  Badge, ActionIcon, Flex, Image,
  Menu, NumberInput, Paper, Loader
} from '@mantine/core';
import { IconGripVertical, IconPlus, IconEdit, IconTrash, IconCheck } from '@tabler/icons-react';

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

import { modals } from '@mantine/modals';
import { CSS } from '@dnd-kit/utilities';

const areExercisesEqual = (arr1, arr2) => {
  // Додаємо перевірку на undefined/null для обох масивів
  if (!Array.isArray(arr1) && !Array.isArray(arr2)) {
    // Якщо обидва не є масивами (наприклад, обидва undefined/null), вважаємо їх рівними
    return arr1 === arr2;
  }

  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    // Якщо один є масивом, а інший ні, вони не рівні
    return false;
  }

  if (arr1.length !== arr2.length) {
    return false;
  }

  const sortedArr1 = [...arr1].sort((a, b) => {
    const idA = a.exerciseId || a.exercise?.id;
    const idB = b.exerciseId || b.exercise?.id;
    return String(idA).localeCompare(String(idB));
  });
  const sortedArr2 = [...arr2].sort((a, b) => {
    const idA = a.exerciseId || a.exercise?.id;
    const idB = b.exerciseId || b.exercise?.id;
    return String(idA).localeCompare(String(idB));
  });

  for (let i = 0; i < sortedArr1.length; i++) {
    const item1 = sortedArr1[i];
    const item2 = sortedArr2[i];

    const id1 = item1.exerciseId || item1.exercise?.id;
    const id2 = item2.exerciseId || item2.exercise?.id;

    if (id1 !== id2 ||
        item1.sets !== item2.sets ||
        item1.valuePerSet !== item2.valuePerSet) {
      return false;
    }
  }
  return true;
};

const WorkoutExercise = memo(function WorkoutExercise({
  id,
  data,
  isEdit,
  onValueChange,
  onRemove
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const currentSets = data.sets;
  const currentValuePerSet = data.valuePerSet;


  return (
    <Paper ref={setNodeRef} style={style}>
      <Group gap="xs" align="center" p="sm">
        <Flex w={50} h={50}>
          {data.exercise?.preview && <Image src={data.exercise.preview} fit="contain" />}
        </Flex>
        <Stack gap={0} miw={75}>
          <Text size='xs' fw={500}>{data.exercise?.name}</Text>
          <Group gap="0" align='baseline'>
            <NumberInput
              variant="filled"
              size="xs"
              radius="xs"
              w={36}
              max={100}
              min={0}
              value={currentSets}
              readOnly={!isEdit}
              styles={(theme) => ({
                input: {
                  background: isEdit ? theme.colors.dark[6] : 'transparent',
                  cursor: isEdit ? 'text' : 'default',
                  borderColor: isEdit ? 'transparent' : 'transparent',
                },
              })}
              onChange={(val) => {
                if (isEdit) {
                  onValueChange(id, 'sets', val);
                }
              }}
            />
            <Text mr="6px" ml="6px" c="dimmed">x</Text>
            <NumberInput
              variant="filled"
              size="xs"
              radius="xs"
              w={100}
              max={100}
              min={0}
              value={currentValuePerSet}
              readOnly={!isEdit}
              suffix={` ${data.exercise?.type}`}
              styles={(theme) => ({
                input: {
                  background: isEdit ? theme.colors.dark[6] : 'transparent',
                  cursor: isEdit ? 'text' : 'default',
                  borderColor: isEdit ? 'transparent' : 'transparent',
                },
              })}
              onChange={(val) => {
                if (isEdit) {
                  onValueChange(id, 'valuePerSet', val);
                }
              }}
            />
          </Group>
        </Stack>
        
        {
          isEdit
          &&
          <ActionIcon.Group  ml="auto">
            <ActionIcon variant='outline' color="red" onClick={() => onRemove(id)}>
              <IconTrash size={16} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="gray" {...attributes} {...listeners}>
              <IconGripVertical size={16} />
            </ActionIcon>
          </ActionIcon.Group>
        }
      </Group>
    </Paper>
  );
});

// function calculateCalories(exercises, allExercises) {
//   let value = 0;
//   exercises.forEach(ex => {
//     const original = allExercises.find(e => e.id === ex.exerciseId);
//     if (original && typeof original.caloriesPerUnit === 'number') {
//       value += ex.sets * ex.valuePerSet * original.caloriesPerUnit;
//     }
//   });
//   return value;
// }

function WorkoutCard({ 
  id,
  name, 
  color, 
  calories, 
  description,
  exercises: initialExercises,
  create = false, 
  onExerciseOrderChange,
  onExerciseValuesChange,
  onDeleteWorkout,
  onExerciseRemove,
  previewMode = false
}) {
  const { t } = useTranslation();
  const [exercises, setExercises] = useState(initialExercises);
  const [isEdit, setIsEdit] = useState(false);
  const [editableExercises, setEditableExercises] = useState(initialExercises);
  const [cardLoading, setCardLoading] = useState(false);

  useEffect(() => {
    if (!areExercisesEqual(exercises, initialExercises)) {
      setExercises(initialExercises);
      setEditableExercises(initialExercises);
    }
  }, [initialExercises, exercises]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = editableExercises.findIndex(e => id + e.exercise.id === active.id);
    const newIndex = editableExercises.findIndex(e => id + e.exercise.id === over.id);

    if (oldIndex !== newIndex) {
      const reordered = arrayMove(editableExercises, oldIndex, newIndex);
      setEditableExercises(reordered);
    }
  };

  const buttonCreateHandler = () => {
    modals.openContextModal({
      modal: 'workout',
      title: <Text span size="xl" fw={700}>Create your workout</Text>,
      size: '100%',
      overlayProps: {
        closeOnClickOutside: false,
      },
    })
  }

  const handleEditWorkout = () => {
    modals.openContextModal({
      modal: 'workout',
      title: <Text span size="xl" fw={700}>Edit your workout</Text>,
      size: '100%',
      overlayProps: {
        closeOnClickOutside: false,
      },
      innerProps: {
        workout: {
          id,
          name, 
          description,
          color, 
          calories, 
          exercises
        } 
      }
    })
  }

  const handleConfirmDeleteWorkout = () => {
    modals.openConfirmModal({
      title: t('workout.delete.title'),
      children: t('workout.delete.description'),
      labels: { confirm: t('workout.delete.confirm'), cancel: t('workout.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        if (onDeleteWorkout) {
          onDeleteWorkout();
        } else {
          console.warn("No onDeleteWorkout prop provided. Cannot delete workout.");
        }
      }
    });
  };

  const handleExerciseValueChange = useCallback((dndId, field, value) => {
    setEditableExercises(prevExercises =>
      prevExercises.map(ex =>
        (id + ex.exercise.id) === dndId
          ? { ...ex, [field]: value }
          : ex
      )
    );
  }, [id]);

  const handleRemoveExercise = useCallback((dndIdToRemove) => {
    setEditableExercises(prevExercises =>
      prevExercises.filter(ex => (id + ex.exercise.id) !== dndIdToRemove)
    );
  }, [id]);

  const handleEditSaveToggle = async () => {
    if (isEdit) {
      if (!areExercisesEqual(exercises, editableExercises)) {
        setCardLoading(true);
        const updatedCalories = editableExercises.reduce(
          (sum, ex) => sum + ex.sets * ex.valuePerSet * (ex.exercise?.caloriesPerUnit || 0),
          0
        );

        // 2. Формування масиву для бекенду (без exercise)
        const cleanedExercises = editableExercises.map(ex => ({
          exerciseId: ex.exerciseId,
          sets: ex.sets,
          valuePerSet: ex.valuePerSet,
          caloriesPerSet: ex.valuePerSet * (ex.exercise?.caloriesPerUnit || 0)
        }));

        await workoutService.updateWorkout({
          id,
          name,
          description,
          color,
          calories: updatedCalories,
          exercises: cleanedExercises,
        });

        setExercises(editableExercises);
        setCardLoading(false);
      }
    } else {
      setEditableExercises([...exercises]);
    }
    setIsEdit(!isEdit);
  };

  const isChanged = !areExercisesEqual(exercises, editableExercises);

  return (
    <>
      {
        !create ? (
          <Card pos='relative' shadow="sm" withBorder padding="md" radius="md"  style={{ borderColor: color }}>
            <Stack gap="xs" h="100%">
              
              <Group wrap='nowrap' justify="space-between" width="100%">
                <Badge variant="light" color={color} size="xl">
                  {name} - {calories} kcal
                </Badge>
                {
                  isEdit
                    ?
                    <ActionIcon.Group gap="4">
                      <ActionIcon
                        variant="outline"
                        aria-label="Save"
                        onClick={handleEditSaveToggle}
                        disabled={cardLoading || !isChanged}
                      >
                        <IconCheck size={14} />
                      </ActionIcon>
                      {
                        !previewMode && 
                        <>
                          <ActionIcon
                            variant="outline"
                            color='orange'
                            aria-label="Edit"
                            onClick={handleEditWorkout}
                          >
                            <IconEdit size={14} />
                          </ActionIcon>
                          <ActionIcon
                            variant="outline" 
                            color="red"
                            aria-label="Delete"
                            onClick={handleConfirmDeleteWorkout}
                          >
                            <IconTrash size={14} />
                          </ActionIcon>
                        </>
                      }
                    </ActionIcon.Group>
                    :
                    <ActionIcon
                      variant="default"
                      aria-label="Edit"
                      onClick={handleEditSaveToggle}
                    >
                      <IconEdit size={14} />
                    </ActionIcon>
                }

              </Group>
              {
                exercises.length > 0 ?
                  isEdit ?
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={editableExercises.map(e => id + e.exercise.id)} 
                      strategy={verticalListSortingStrategy}
                    >
                      <Stack gap="xs" h="100%">
                        {editableExercises.map((exerciseData) => (
                          <WorkoutExercise
                            key={id + exerciseData.exercise.id}
                            id={id + exerciseData.exercise.id}
                            data={exerciseData}
                            isEdit={true}
                            onValueChange={handleExerciseValueChange}
                            onRemove={handleRemoveExercise}
                          />
                        ))}
                      </Stack>
                    </SortableContext>
                  </DndContext>
                  :
                  <Stack gap="xs" h="100%">
                    {
                      exercises.map((exerciseData) => (
                      <WorkoutExercise
                        key={id + exerciseData.exercise.id}
                        id={id + exerciseData.exercise.id}
                        data={exerciseData}
                        isEdit={false}
                      />
                      ))
                    }
                  </Stack>
                : 
                <Paper flex="1">
                  <Stack h='100%' justify='center'>
                    <Text p="sm" ta='center'>
                      No exercises..
                    </Text>
                  </Stack>
                </Paper>
              }
            </Stack>
            <Text size="sm" c="dimmed" mt="md">
              {description || t('workout.noDescription')}
            </Text>
            {cardLoading && (
              <Flex pos="absolute" top='0' bottom='0' left='0' right='0' flex={1} justify='center' align='center'>
                <Loader />
              </Flex>
            )}
          </Card>
        ) : (
          <Card shadow="sm" padding="0" radius="md">
            <ActionIcon
              radius="md"
              w="100%"
              h="100%"
              variant="default"
              size="xl"
              aria-label="Create workout"
              onClick={buttonCreateHandler}
            >
              <IconPlus stroke={1.5} />
            </ActionIcon>
          </Card>
        )
      }
    </>
  );
}

export default WorkoutCard;