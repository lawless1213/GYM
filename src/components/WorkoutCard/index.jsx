import { useState, useRef, memo  } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card, Title, Text, Group, Stack,
  Badge, ActionIcon, Flex, Image
} from '@mantine/core';
import { IconGripVertical, IconPlus } from '@tabler/icons-react';

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
        <Image src={data.exercise.preview} fit="contain" />
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

  return (
    <>
      {
        !create ? (
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Stack gap="xs" h="100%">
              <Group justify="space-between" align="center">
                <Title order={3} style={{ color }}>{name}</Title>
                <Badge size="lg">{calories} kcal</Badge>
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
                    <ActionIcon mt="auto" w="100%" variant="default" size="xl" aria-label="Add exercise to workout">
                      <IconPlus stroke={1.5} />
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
