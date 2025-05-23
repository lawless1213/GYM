import { useState, useRef, memo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card, Title, Text, Group, Stack,
  Badge, ActionIcon, Flex, Image,
  Menu, NumberInput, Paper
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
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    const id1 = arr1[i].exerciseId || arr1[i].exercise?.id;
    const id2 = arr2[i].exerciseId || arr2[i].exercise?.id;

    if (id1 !== id2 ||
        arr1[i].sets !== arr2[i].sets ||
        arr1[i].valuePerSet !== arr2[i].valuePerSet) {
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
          {/* {data.exercise?.preview && <Image src={data.exercise.preview} fit="contain" />} */}
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
          <ActionIcon variant="subtle" color="gray" ml="auto" {...attributes} {...listeners}>
            <IconGripVertical size={16} />
          </ActionIcon>
        }
      </Group>
    </Paper>
  );
});


function WorkoutCard({ 
  id,
  name, 
  color, 
  calories, 
  exercises: initialExercises,
  create = false, 
  onExerciseOrderChange,
  onExerciseValuesChange,
  onDeleteWorkout,
  previewMode = false
}) {
  const { t } = useTranslation();
  const [exercises, setExercises] = useState(initialExercises);
  const [isEdit, setIsEdit] = useState(false);
  const [editableExercises, setEditableExercises] = useState(initialExercises);

  useEffect(() => {
    setExercises(initialExercises);
    setEditableExercises(initialExercises);
  }, [initialExercises]);

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

      if (onExerciseOrderChange) {
        const cleanedReordered = reordered.map(ex => ({
          exerciseId: ex.exerciseId,
          sets: ex.sets,
          valuePerSet: ex.valuePerSet
        }));
        onExerciseOrderChange(cleanedReordered);
      }

      console.log(`Moved: "${reordered[newIndex].exercise.name}" from original index ${oldIndex} to ${newIndex}`);
    }
  };

  const buttonCreateHandler = () => {
    modals.openContextModal({
      modal: 'workout',
      title: <Title order={2}>Create your workout</Title>,
      size: '100%',
    })
  }

  const handleEditWorkout = () => {
    modals.openContextModal({
      modal: 'workout',
      title: <Title order={2}>Edit your workout</Title>,
      size: '100%',
      innerProps: {
        workout: {
          id,
          name, 
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

  const handleEditSaveToggle = async () => {
    if (isEdit) {
      if (!areExercisesEqual(exercises, editableExercises)) {
        console.log('Зміни виявлено. Зберігаємо дані:', editableExercises);
        setExercises(editableExercises);

        if (onExerciseValuesChange) {
          const cleanedExercises = editableExercises.map(ex => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            valuePerSet: ex.valuePerSet
          }));
          await onExerciseValuesChange(cleanedExercises);
        }
      } else {
        console.log('Змін не виявлено. Нічого не зберігаємо.');
      }
    } else {
      setEditableExercises([...exercises]);
    }
    setIsEdit(!isEdit);
  };


  return (
    <>
      {
        !create ? (
          <Card shadow="sm" withBorder padding="md" radius="md"  style={{ borderColor: color }}>
            <Stack gap="xs" h="100%">
              
              <Group wrap='nowrap' justify="space-between" width="100%">
                <Badge variant="light" color={color} size="xl">
                  {name} - {calories} kcal
                </Badge>
                {
                  isEdit
                    ?
                    <Group gap="4">
                      <ActionIcon
                        variant="outline"
                        aria-label="Save"
                        onClick={handleEditSaveToggle}
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
                            // variant="default"
                            variant="outline" 
                            color="red"
                            aria-label="Delete"
                            onClick={handleConfirmDeleteWorkout}
                          >
                            <IconTrash size={14} />
                          </ActionIcon>
                        </>
                      }
                    </Group>
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
                            id={id + exerciseData.exercise.id} // DND ID
                            data={exerciseData} // Передаємо "збагачені" дані для відображення
                            isEdit={true}
                            onValueChange={handleExerciseValueChange}
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