import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_SCHEDULE } from '../../queries/schedule';
import dayjs from "dayjs";
import isoWeek from 'dayjs/plugin/isoWeek';
import { ActionIcon, Button, Group, Text, Indicator  } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

dayjs.extend(isoWeek);

function WorkoutSchedule() {
	const [value, setValue] = useState(new Date());

	const [weekOffset, setWeekOffset] = useState(0);

	const currentWeekStart = dayjs().add(weekOffset, 'week').startOf('isoWeek');

	const days = Array.from({ length: 7 }, (_, i) =>
		currentWeekStart.add(i, 'day')
	);
	const isSelected = (date) =>
    value && dayjs(value).isSame(date, 'day');

	const startDate = days[0].format('YYYY-MM-DD');
	const endDate = days[6].format('YYYY-MM-DD');

  const { data, loading, error } = useQuery(GET_USER_SCHEDULE, {
    variables: { startDate, endDate }
  });

  const schedule = data?.getUserSchedule || [];
	console.log('schedule', schedule);
	
  return (
    <Group spacing="xs" align="center" position="center" wrap='nowrap' justify='center'>
      <ActionIcon
        variant="transparent"
        onClick={() => setWeekOffset((w) => w - 1)}
        size="lg"
      >
        <IconChevronLeft />
      </ActionIcon>

      <Group spacing="xs" align="center" position="center" justify='center'>
				{days.map((day) => {
					const dayStr = day.format('YYYY-MM-DD');
					const scheduleDay = schedule.find(d => d.date === dayStr);

					if(scheduleDay) {
						return (
							<Indicator processing  color={scheduleDay.workouts[0].workout.color}>
								<Button
									key={dayStr}
									variant={isSelected(day) ? 'outline' : 'default'}
									radius="s"
									size="md"
									styles={{
										label: { flexDirection: 'column' },
									}}
								>
									{/* <Text size="xs" ta="center">{day.format('dd')}</Text> */}
									<Text size="sm" ta="center" fw={500}>{day.format('DD.MM')}</Text>
									{/* Відображаємо інфу про тренування, якщо є */}
									<Text size="xs" c="green">
										{scheduleDay.workouts.length} трен.
									</Text>
								</Button>
							</Indicator>
						)
					}

					return (
						<Button
							key={dayStr}
							variant={isSelected(day) ? 'outline' : 'default'}
							radius="s"
							size="md"
							styles={{
								label: { flexDirection: 'column' },
							}}
						>
							<Text size="xs" ta="center">{day.format('dd')}</Text>
							<Text size="sm" ta="center" fw={500}>{day.format('DD.MM')}</Text>
						</Button>
					);
				})}
			</Group>

      <ActionIcon
        variant="transparent"
        onClick={() => setWeekOffset((w) => w + 1)}
        size="lg"
      >
        <IconChevronRight />
      </ActionIcon>
    </Group>
  );
}

export default WorkoutSchedule;
