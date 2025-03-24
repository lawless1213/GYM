import { Card, Title, Text, Group, Stack, Badge, Image } from '@mantine/core';
import { useTranslation } from 'react-i18next';

function WorkoutCard({ id, name, color, calories, exercises }) {
  const { t } = useTranslation();

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Stack gap="xs">
        <Group justify="space-between" align="center">
          <Title order={3} style={{ color }}>{name}</Title>
          <Badge size="lg">{calories} kcal</Badge>
        </Group>
        
        <Stack gap="xs">
          {exercises.map((exerciseData, index) => (
            <Group key={index} align="center">
              <Image 
                src={exerciseData.exercise.preview} 
                width={50} 
                height={50} 
                radius="md"
              />
              <Stack gap={0}>
                <Text size="sm" fw={500}>{exerciseData.exercise.name}</Text>
                <Text size="xs" c="dimmed">
                  {exerciseData.sets} × {exerciseData.valuePerSet} {exerciseData.exercise.type}
                </Text>
              </Stack>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}

export default WorkoutCard; 