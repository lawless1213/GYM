import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_SCHEDULE } from '../../queries/schedule';
import dayjs from "dayjs";
import isoWeek from 'dayjs/plugin/isoWeek';
import { ActionIcon, Button, Group, Grid , Text, Indicator, Popover, List, ThemeIcon } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';
import { IconChevronLeft, IconChevronRight, IconCircleCheck, IconCircleDashed } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

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
    <Group spacing="xs" align="center" position="center" w="100%" wrap='nowrap'>
      <ActionIcon
        variant="transparent"
        onClick={() => setWeekOffset((w) => w - 1)}
        size="lg"
      >
        <IconChevronLeft />
      </ActionIcon>
			<Group justify="center" align="center" >
				{days.map((day) => {
					const [opened, { close, open }] = useDisclosure(false);
					const dayStr = day.format('YYYY-MM-DD');
					const scheduleDay = schedule.find(d => d.date === dayStr);

					if(scheduleDay) {
						const allCompleted = scheduleDay.workouts.length > 0 && scheduleDay.workouts.every(w => w.completed);
						return (
					
								<Popover width={300} position="bottom" withArrow shadow="md" opened={opened}>
									<Popover.Target>
										<Indicator
											color={allCompleted ? 'teal' : ''}
											processing={isSelected(day) && !allCompleted}
											label={scheduleDay.workouts.length}
											size={16}
											>
											<Button
												key={dayStr}
												variant={isSelected(day) ? 'outline' : 'default'}
												radius="s"
												size="md"
												onMouseEnter={open}
												onMouseLeave={close}
												styles={{
													label: { flexDirection: 'column' },
												}}
											>
												<Text size="xs" ta="center">{day.format('dd')}</Text>
												<Text size="sm" ta="center" fw={500}>{day.format('DD.MM')}</Text>
											</Button>
										</Indicator>
									</Popover.Target>
									<Popover.Dropdown style={{ pointerEvents: 'none' }}>
										<List
											spacing="xs"
											size="sm"
											center
											icon={
												<ThemeIcon size={24} radius="xl">
													<IconCircleDashed size={16} />
												</ThemeIcon>
											}
											>
											{scheduleDay.workouts.map((workout) => (
												<List.Item 
												key={workout.id || workout.note}
												icon={
													workout.completed &&
													<ThemeIcon color="teal" size={24} radius="xl">
															<IconCircleCheck size={16} />
														</ThemeIcon>
													}
													>
													<Group align="flex-start">
														<Text>{workout.time}</Text>
														<Text>{workout.note}</Text>
													</Group>
												</List.Item>
											))}
										</List>
									</Popover.Dropdown>
								</Popover>
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
