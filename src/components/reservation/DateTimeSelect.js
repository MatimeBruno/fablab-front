import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const DateTimeSelect = () => {
	const [dateValue, setDateValue] = useState(new Date());

	const setDate = (date) => {
		setDateValue(date);
	}

	return (
		<div>
			<Calendar onChange={setDate} value={dateValue} locale="fr" />
		</div>
	);
}

export default DateTimeSelect;