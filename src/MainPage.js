import React, { useContext, useEffect, useState } from "react";
import AuthContext from "./context/AuthProvider";
import axios from "./api/axios";
import moment from "moment";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const locales = {
	"en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales,
});

const events = [
	{
		title: "Big Meeting",
		allDay: true,
		start: new Date(2022, 7, 1),
		end: new Date(2022, 7, 3),
	},
	{
		title: "Vacation",
		start: new Date(2022, 7, 7),
		end: new Date(2022, 7, 10),
	},
	{
		title: "Conference",
		start: new Date(2022, 7, 20),
		end: new Date(2022, 7, 23),
	},
];

function MainPage() {
	const { auth } = useContext(AuthContext);
	const [appointments, setAppointments] = useState([]);

	const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
	const [allEvents, setAllEvents] = useState(events);

	function handleAddEvent() {
		setAllEvents([...allEvents, newEvent]);
	}

	useEffect(() => {
		const fetchTypes = async () => {
			try {
				var date1 = new Date("2022, 06, 22");
				var dateFormat = moment(date1).format("YYYY-MM-DD");

				console.log(dateFormat);

				const response = await axios.post(
					`/appointment/${dateFormat}`,
					{},
					{ headers: { Authorization: `Bearer ${auth.token}` } }
				);

				console.log(response.data);
				setAppointments(response.data);
			} catch (err) {
				console.log("ERROR!!!" + err); // not in 200
			}
		};

		fetchTypes();
	}, []);

	return (
		<div>
			<h1>Calendar</h1>
			<h2>Add event</h2>
			<div>
				<input
					type="text"
					placeholder="Add Title"
					style={{ width: "20%", marginRight: "10px" }}
					value={newEvent.title}
					onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
				/>
				<DatePicker
					placeholderText="Start Date"
					style={{ marginRight: "10px" }}
					selected={newEvent.start}
					onChange={start => setNewEvent({ ...newEvent, start })}
				/>
				<DatePicker
					placeholderText="End Date"
					selected={newEvent.end}
					onChange={end => setNewEvent({ ...newEvent, end })}
				/>
				<button stlye={{ marginTop: "10px" }} onClick={handleAddEvent}>
					Add Event
				</button>
			</div>
			<Calendar
				localizer={localizer}
				events={allEvents}
				startAccessor="start"
				endAccessor="end"
				style={{ height: 500, margin: "50px" }}
			/>
		</div>
	);
}

export default MainPage;
