import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Title, Text, Group, Stack, Badge, Image, ActionIcon, Box, Container, Flex } from '@mantine/core';
import { IconGripVertical, IconPlus } from '@tabler/icons-react';
import { useSortable } from '@dnd-kit/react/sortable';
import { CSS } from '@dnd-kit/utilities';


function WorkoutExercise({id, index, data}) {
  const handleRef = useRef(null);
  const {
    isDragging,
    transform,
    transition, 
    ref
  } = useSortable({
    id, 
    index,
    handle: handleRef
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Group ref={ref} key={index} align="center" style={style} >
      <Flex  w={50} h={50} >
        <Image 
          src={data.exercise.preview} 
          fit='contain'
        />
      </Flex>
      <Stack gap={0}>
        <Text size="sm" fw={500}>{data.exercise.name}</Text>
        <Text size="xs" c="dimmed">
          {data.sets} × {data.valuePerSet} {data.exercise.type}
        </Text>
      </Stack>
      <ActionIcon 
        variant="subtle" 
        color="gray" 
        ml="auto"
        ref={handleRef}
      >
        <IconGripVertical size={16} />
      </ActionIcon>
    </Group>
  );
}

function WorkoutCard({ id, name, color, calories, exercises, create = false }) {
  const { t } = useTranslation();

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      {
        !create ? 
          <Stack gap="xs">
            <Group justify="space-between" align="center">
              <Title order={3} style={{ color }}>{name}</Title>
              <Badge size="lg">{calories} kcal</Badge>
            </Group>
            
            <Stack gap="xs">
              {exercises.map((exerciseData, index) => (
                <WorkoutExercise key={id + exerciseData.exercise.id} id={id + exerciseData.exercise.id} index={index} data={exerciseData} />
              ))}
            </Stack>
          </Stack>
        :
        <ActionIcon m='auto' variant="transparent" size="xl" aria-label="Create">
          <IconPlus style={{ width: '100%', height: '100%' }} stroke={1.5}/>
        </ActionIcon>
      }
    </Card>
  );
}

export default WorkoutCard; 