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
import "./App.css";
import DataTable from "./DataTable";

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

function MainPage() {
	const { auth } = useContext(AuthContext);

	const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
	const [newFormEvent, setNewFormEvent] = useState({
		title: "",
		desc: "",
		date: "",
		start: "",
		end: "",
		attendies: "",
		classroom: "",
	});
	const [allEvents, setAllEvents] = useState([]);
	const [classroomTypes, setClassroomTypes] = useState([]);

	function handleAddEvent() {
		setAllEvents([...allEvents, newEvent]);
	}

	useEffect(() => {
		const fetchClassroomTypes = async () => {
			try {
				let response = await axios.get(`common/classroom/names`, {
					headers: { Authorization: `Bearer ${auth.token}` },
				});
				// zaglavlje tabele
				let resourceMap = [];
				response.data.forEach(el => {
					resourceMap.push({
						resourceId: el.id,
						resourceTitle: el.name,
					});
				});

				setClassroomTypes(resourceMap);
			} catch (err) {
				console.log("ERROR!!!" + err); // not in 200
			}
		};

		const fetchAppointments = async () => {
			try {
				// var date1 = new Date("2022, 06, 22");
				// var dateFormat = moment(date1).format("YYYY-MM-DD");
				// const response = await axios.post(`/appointment/${dateFormat}`,{},{ headers: { Authorization: `Bearer ${auth.token}` } });

				let response = await axios.get(`/appointment`, { headers: { Authorization: `Bearer ${auth.token}` } });

				const appointments = response.data;
				const newAr = [];
				// transformacija niza iz baze u niz za prikaz
				appointments.forEach(el => {
					const dates = el.date.split("-");

					newAr.push({
						id: el.id,
						start: new Date(dates[0], dates[1] - 1, dates[2], el.start_timeInHours, 0, 0),
						end: new Date(dates[0], dates[1] - 1, dates[2], el.end_timeInHours, 0, 0),
						title: el.name,
						resourceId: el.classroom.id,
					});
				});

				setAllEvents(newAr);
			} catch (err) {
				console.log("ERROR!!!" + err); // not in 200
			}
		};

		fetchClassroomTypes();
		fetchAppointments();
	}, []);

	return (
		<div>
			{/* Ovaj div u novu komponentu */}
			<div className="laga">
				<div className="dugmad">
					<button>Dodaj dogadjaj</button>
					<button>Rezervisi dogadjaj</button>
				</div>

				<input
					type="text"
					placeholder="Add Title"
					style={{ width: "20%", marginRight: "10px" }}
					value={newFormEvent.title}
					onChange={e => setNewFormEvent({ ...newFormEvent, title: e.target.value })}
				/>
				<input
					type="text"
					placeholder="Add Desc"
					style={{ width: "20%", marginRight: "10px" }}
					value={newFormEvent.desc}
					onChange={e => setNewFormEvent({ ...newFormEvent, desc: e.target.value })}
				/>
				<input
					type="time"
					placeholder="Add start time"
					style={{ width: "20%", marginRight: "10px" }}
					value={newFormEvent.start}
					onChange={e => setNewFormEvent({ ...newFormEvent, start: e.target.value })}
				/>
				<input
					type="time"
					placeholder="Add end time"
					style={{ width: "20%", marginRight: "10px" }}
					value={newFormEvent.end}
					onChange={e => setNewFormEvent({ ...newFormEvent, end: e.target.value })}
				/>

				<DatePicker
					className="datepick"
					placeholderText="Date"
					style={{ marginRight: "10px" }}
					selected={newFormEvent.date}
					onChange={date => setNewFormEvent({ ...newFormEvent, date })}
				/>
				<input
					type="number"
					placeholder="Add number of attendies"
					style={{ width: "20%", marginRight: "10px" }}
					value={newFormEvent.attendies}
					onChange={e => setNewFormEvent({ ...newFormEvent, attendies: e.target.value })}
				/>
				<DataTable />
				{console.log(newFormEvent)}
				<button stlye={{ marginTop: "10px" }} onClick={handleAddEvent}>
					Add Event
				</button>
			</div>
			<Calendar
				localizer={localizer}
				events={allEvents}
				startAccessor="start"
				endAccessor="end"
				style={{ height: 1200, margin: "50px" }}
				resourceIdAccessor="resourceId"
				resources={classroomTypes}
				resourceTitleAccessor="resourceTitle"
			/>
		</div>
	);
}

export default MainPage;
