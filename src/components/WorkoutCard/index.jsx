import { useState, useRef, memo  } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card, Title, Text, Group, Stack,
  Badge, ActionIcon, Flex, Image,
  Menu, NumberInput, Paper
} from '@mantine/core';
import { IconGripVertical, IconPlus, IconEdit, IconTrash, IconCheck  } from '@tabler/icons-react';

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

const WorkoutExercise = memo(function WorkoutExercise({ id, index, data, isEdit }) {
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

  return (
    <Paper ref={setNodeRef} key={index} style={style}>
      <Group gap="xs" align="center" p="xs">
        <Stack  gap={0} miw={75}>
          <Text size='xs' fw={500}>{data.exercise.name}</Text>
          <Flex w={50} h={50}>
            <Image src={data.exercise.preview} fit="contain" />
          </Flex>
        </Stack>
        {
          isEdit 
          ? 
          <Group gap="xs" align='baseline'>
            <NumberInput
              variant="filled"
              size="xs"
              radius="xs"
              w={50}
              max={100}
              min={0}
              startValue={data.sets}
            />
            <Text c="dimmed">x</Text>
            <NumberInput
              variant="filled"
              size="xs"
              radius="xs"
              w={50}
              max={100}
              min={0}
              startValue={data.valuePerSet}
            />
            <Text c="dimmed">{data.exercise.type}</Text>
          </Group>
          :
          <Group gap="xs" align='baseline'>
            <Text size='26px' c="dimmed">{data.sets}</Text>
            <Text c="dimmed">x</Text>
            <Text size='26px' c="dimmed">{data.valuePerSet}</Text>
            <Text c="dimmed">{data.exercise.type}</Text>
          </Group>
        }
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
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  console.log(exercises);
  

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
  
    const oldIndex = exercises.findIndex(e => id + e.exercise.id === active.id);
    const newIndex = exercises.findIndex(e => id + e.exercise.id === over.id);
  
    if (oldIndex !== newIndex) {
      const reordered = arrayMove(exercises, oldIndex, newIndex);
      setExercises(reordered);
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

  const handleDeleteWorkout  = async () => {
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

  return (
    <>
      {
        !create ? (
          <Card shadow="sm" padding="md" radius="md" withBorder style={{ borderColor: color }}>
            <Stack gap="xs" h="100%">
              <Badge m="auto" fullWidth variant="light" color={ color } size="xl" style={{ 'flex-shrink': '0' }}>
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
                        onClick={() => {setIsEdit(!isEdit)}}
                      >
                        <IconCheck size={14}/>
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
                        <IconTrash size={14}/>
                      </ActionIcon>
                    </Group> 
                  :
                    <ActionIcon 
                      variant="default" 
                      aria-label="Edit"
                      onClick={() => {setIsEdit(!isEdit)}}
                    >
                      <IconEdit size={14}/>
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
                      {exercises.map((exerciseData, index) => (
                        <WorkoutExercise
                          key={id + exerciseData.exercise.id}
                          id={id + exerciseData.exercise.id}
                          index={index}
                          data={exerciseData}
                          isEdit={true}
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
