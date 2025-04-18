import { useState, useRef, memo  } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card, Title, Text, Group, Stack,
  Badge, ActionIcon, Flex, Image,
  Menu
} from '@mantine/core';
import { IconGripVertical, IconPlus, IconEdit, IconTrash, IconDotsVertical } from '@tabler/icons-react';

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

const WorkoutExercise = memo(function WorkoutExercise({ id, index, data }) {
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
    <Group ref={setNodeRef} key={index} align="center" style={style}>
      <Flex w={50} h={50}>
        {/* <Image src={data.exercise.preview} fit="contain" /> */}
      </Flex>
      <Stack gap={0}>
        <Text size="sm" fw={500}>{data.exercise.name}</Text>
        <Text size="xs" c="dimmed">
          {data.sets} × {data.valuePerSet} {data.exercise.type}
        </Text>
      </Stack>
      <ActionIcon variant="subtle" color="gray" ml="auto" {...attributes} {...listeners}>
        <IconGripVertical size={16} />
      </ActionIcon>
    </Group>
  );
});

function WorkoutCard({ id, name, color, calories, exercises: initialExercises, create = false, onExerciseOrderChange }) {
  const { t } = useTranslation();
  const [exercises, setExercises] = useState(initialExercises);
  
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
                <Menu position="bottom-end" shadow="md" width={200}>
                  <Menu.Target>
                    <ActionIcon variant="default" aria-label="Settings">
                      <IconDotsVertical/>
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item 
                      leftSection={<IconEdit size={14} />}
                      // onClick={editHandler}
                    >
                      {t(`workout.edit`)}
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Item
                      color="red"
                      leftSection={<IconTrash size={14} />}
                      onClick={() => modals.openConfirmModal({
                        title: t('workout.delete.title'),
                        children: t('workout.delete.description'),
                        labels: { confirm: t('workout.delete.confirm'), cancel: t('workout.delete.cancel') },
                        confirmProps: { color: 'red' },
                        onConfirm: () => handleDeleteWorkout()
                      })}
                    >
                      {t(`workout.delete`)}
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>

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
                      <IconPlus color={ color } stroke={1.5} />
                    </ActionIcon>
                  </Stack>
                </SortableContext>
              </DndContext>
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
