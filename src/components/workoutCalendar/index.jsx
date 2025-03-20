import { DatePicker } from '@mantine/dates';
import { useState } from 'react';

function WorkoutCalendar() {
		const [value, setValue] = useState(new Date());

    return (
        <DatePicker 
					hideOutsideDates 
					size="md"
					allowDeselect 
					value={value} 
					onChange={setValue}
				/>
    )
}

export default WorkoutCalendar;
