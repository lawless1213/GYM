import { useState, useRef, memo, useEffect } from 'react';
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
import workoutService from '../../services/workoutService';

// Допоміжна функція для порівняння масивів об'єктів
const areExercisesEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    // Порівнюємо ID вправи (якщо вони унікальні)
    if (arr1[i].exercise.id !== arr2[i].exercise.id ||
        arr1[i].sets !== arr2[i].sets ||
        arr1[i].valuePerSet !== arr2[i].valuePerSet) {
      return false;
    }
  }
  return true;
};


// Компонент WorkoutExercise приймає пропси для керування своїм станом
const WorkoutExercise = memo(function WorkoutExercise({
  id,
  index,
  data, // Оригінальні дані в режимі перегляду
  isEdit,
  onValueChange, // Функція зворотного виклику для зміни значень
  editableData // Дані для редагування
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

  // Визначаємо, яке значення використовувати: editableData (якщо є) або data
  const currentSets = isEdit ? (editableData?.sets ?? 0) : data.sets;
  const currentValuePerSet = isEdit ? (editableData?.valuePerSet ?? 0) : data.valuePerSet;

  return (
    <Paper ref={setNodeRef} key={index} style={style}>
      <Group gap="xs" align="center" p="sm">
        <Stack gap={0} miw={75}>
          <Text size='xs' fw={500}>{data.exercise.name}</Text>
          <Flex w={50} h={50}>
            <Image src={data.exercise.preview} fit="contain" />
          </Flex>
        </Stack>
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
                cursor: isEdit ? 'text' : 'default',
                '&:focus-within': {
                  borderColor: isEdit ? theme.colors[theme.primaryColor][6] : 'transparent',
                },
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
            suffix={` ${data.exercise.type}`}
            styles={(theme) => ({
              input: {
                cursor: isEdit ? 'text' : 'default',
                '&:focus-within': {
                  borderColor: isEdit ? theme.colors[theme.primaryColor][6] : 'transparent',
                },
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

function WorkoutCard({ id, name, color, calories, exercises: initialExercises, create = false, onExerciseOrderChange }) {
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

    const oldIndex = exercises.findIndex(e => id + e.exercise.id === active.id);
    const newIndex = exercises.findIndex(e => id + e.exercise.id === over.id);

    if (oldIndex !== newIndex) {
      const reordered = arrayMove(exercises, oldIndex, newIndex);
      setExercises(reordered);
      setEditableExercises(arrayMove(editableExercises, oldIndex, newIndex));
      onExerciseOrderChange?.(reordered);

      const movedExercise = exercises[oldIndex];
      console.log(`Moved: "${movedExercise.exercise.name}" from ${oldIndex} to ${newIndex}`);
    }
  };

  const buttonCreateHandler = () => {
    modals.openContextModal({
      modal: 'workout',
      title: <Title order={2}>Create your workout</Title>,
      size: 'lg',
    })
  }

  const handleDeleteWorkout = async () => {
    await workoutService.deleteWorkout({ id });
  };

  const buttonAddExerciseHandler = () => {
    modals.openContextModal({
      modal: 'workoutExercise',
      title: <Title order={2}>Add exercise to your workout</Title>,
      size: 'xl',
      innerProps: {
        workout: { id }
      }
    })
  }

  const handleExerciseValueChange = (exerciseId, field, value) => {
    setEditableExercises(prevExercises =>
      prevExercises.map(ex =>
        (id + ex.exercise.id) === exerciseId
          ? { ...ex, [field]: value }
          : ex
      )
    );
  };

  const handleEditSaveToggle = () => {
    if (isEdit) {
      if (!areExercisesEqual(exercises, editableExercises)) {
        console.log('Зміни виявлено. Зберігаємо дані:', editableExercises);
        setExercises(editableExercises);
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
          <Card shadow="sm" padding="md" radius="md" withBorder style={{ borderColor: color }}>
            <Stack gap="xs" h="100%">
              <Badge m="auto" fullWidth variant="light" color={color} size="xl" style={{ 'flex-shrink': '0' }}>
                {name}
              </Badge>
              <Group wrap='nowrap' justify="space-between" width="100%">
                <Badge variant="light" size="lg">{calories} kcal</Badge>
                {
                  isEdit
                    ?
                    <Group gap="4">

                      <ActionIcon
                        variant="default"
                        aria-label="Edit"
                        onClick={handleEditSaveToggle}
                      >
                        <IconCheck size={14} />
                      </ActionIcon>
                      <ActionIcon
                        variant="default"
                        aria-label="Delete"
                        onClick={() => modals.openConfirmModal({
                          title: t('workout.delete.title'),
                          children: t('workout.delete.description'),
                          labels: { confirm: t('workout.delete.confirm'), cancel: t('workout.delete.cancel') },
                          confirmProps: { color: 'red' },
                          onConfirm: () => handleDeleteWorkout()
                        })}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
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

              {isEdit ?
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={exercises.map(e => id + e.exercise.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <Stack gap="xs" h="100%">
                      {editableExercises.map((exerciseData, index) => (
                        <WorkoutExercise
                          key={id + exerciseData.exercise.id}
                          id={id + exerciseData.exercise.id}
                          index={index}
                          data={exerciseData}
                          isEdit={true}
                          onValueChange={handleExerciseValueChange}
                          editableData={editableExercises.find(ex => (id + ex.exercise.id) === (id + exerciseData.exercise.id))}
                        />
                      ))}
                      <ActionIcon
                        h="100%"
                        w="100%"
                        variant="default"
                        size="xl"
                        aria-label="Add exercise to workout"
                        onClick={buttonAddExerciseHandler}
                      >
                        <IconPlus color={color} stroke={1.5} />
                      </ActionIcon>
                    </Stack>
                  </SortableContext>
                </DndContext>
                :
                <Stack gap="xs" h="100%">
                  {exercises.map((exerciseData, index) => (
                    <WorkoutExercise
                      key={id + exerciseData.exercise.id}
                      id={id + exerciseData.exercise.id}
                      index={index}
                      data={exerciseData}
                      isEdit={false}
                      // У режимі перегляду `onValueChange` та `editableData` не потрібні
                      // Але якщо вони не передаються, то їх значення будуть `undefined`
                      // що дозволить внутрішнім NumberInput правильно визначити readOnly
                    />
                  ))}
                </Stack>
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