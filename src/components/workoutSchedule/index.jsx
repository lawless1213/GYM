import { DatePicker } from '@mantine/dates';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_SCHEDULE } from '../../queries/schedule';
import dayjs from "dayjs";


function WorkoutSchedule() {
		// const [value, setValue] = useState(new Date());

  const [range, setRange] = useState(["2025-07-02", "2025-07-10"]); // [start, end]

  // Формуємо дати для запиту, якщо обрано обидві
  const startDate = range[0] ? dayjs(range[0]).format('YYYY-MM-DD') : null;
  const endDate = range[1] ? dayjs(range[1]).format('YYYY-MM-DD') : null;

	// const startDate = "2025-07-02";
  // const endDate = "2025-07-05";

  const { data, loading, error } = useQuery(GET_USER_SCHEDULE, {
    skip: !startDate || !endDate, // не робити запит, якщо не обрано обидві дати
    variables: { startDate, endDate }
  });

  const schedule = data?.getUserSchedule || [];

	console.log('schedule', schedule);
	

  return (
    <>
      <DatePicker
        type="range"
        hideOutsideDates
        size="md"
        allowDeselect
        value={range}
      />
    </>
  );
}

export default WorkoutSchedule;
