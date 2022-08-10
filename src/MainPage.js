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
import BasicTable from "./BasicTable";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Checkbox } from "@mui/material";
import Select from "react-select";
import PopUp from "./components/PopUp";

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

	const [selectedOption, setSelectedOption] = useState("");
	const [newFormEvent, setNewFormEvent] = useState({
		title: "",
		desc: "",
		reason: "",
		date: "",
		start: "",
		end: "",
		attendies: "",
		type: "",
		classroom: {
			id: "",
			selected: "", // classroom kao niz idjeva ne treba mi slected na osnovu selecteda izvlacim idjeve
		}, // ovo kao niz da uzmem sve ucionice
	});
	const [allEvents, setAllEvents] = useState([]);
	const [classroomTypes, setClassroomTypes] = useState([]);

	const [rows, setRows] = useState([]);
	// const [selected, setSelected] = useState({ id: "", selected: "" });
	const [appointmentTypes, setAppointmentTypes] = useState([]);

	const [appointmentsToReserve, setAppointmentsToReserve] = useState([]);
	const [openPopup, setOpenPopup] = useState(false);

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

		const fetchClassroomNameTypeAttendies = async () => {
			try {
				let response = await axios.get(`classroom/table`, {
					headers: { Authorization: `Bearer ${auth.token}` },
				});
				setRows(response.data);
			} catch (err) {
				console.log("ERROR!!!" + err); // not in 200
			}
		};

		const fetchAppointmentTypes = async () => {
			try {
				let response = await axios.get(`common/appointment/types`, {
					headers: { Authorization: `Bearer ${auth.token}` },
				});

				const ar = response.data.map(el => {
					return { label: el.name, value: el.id };
				});

				setAppointmentTypes(ar);
			} catch (err) {
				console.log("ERROR!!!" + err); // not in 200
			}
		};

		fetchClassroomTypes();
		fetchAppointments();
		fetchClassroomNameTypeAttendies();
		fetchAppointmentTypes();
	}, []);

	console.log(newFormEvent);

	async function handleAddEvent() {
		setNewFormEvent({ ...newFormEvent, type: selectedOption.value });
		let arr = [];
		arr.push(newFormEvent);
		// setAllEvents([...allEvents, newFormEvent]); // dodam u niz novi form event
		setAppointmentsToReserve();

		let dateFormated = moment(newFormEvent.date).format("YYYY-MM-DD");
		const arrayOfBojects = [
			{
				email: auth.email,
				classroomId: newFormEvent.classroom.id,
				name: newFormEvent.title,
				date: dateFormated,
				decription: newFormEvent.desc,
				reason: newFormEvent.reason,
				number_of_attendies: parseInt(newFormEvent.attendies),
				start_timeInHours: parseInt(newFormEvent.start),
				end_timeInHours: parseInt(newFormEvent.end),
				type: selectedOption.value,
			},
		];

		try {
			let response = await axios.post(`appointment/reserve`, arrayOfBojects, {
				headers: { Authorization: `Bearer ${auth.token}` },
			});
			console.log(response.data);
		} catch (err) {
			console.log(err); // not in 200
		}
	}

	return (
		<div>
			{/* Ovaj div u novu komponentu */}
			<div className="laga">
				<div className="dugmad">
					<button onClick={() => setOpenPopup(true)}>Dodaj dogadjaj</button>
					<button>Rezervisi dogadjaj</button>
				</div>

				<PopUp title="Add appointment" openPopup={openPopup} setOpenPopup={setOpenPopup}>
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
						type="text"
						placeholder="Add Reason"
						style={{ width: "20%", marginRight: "10px" }}
						value={newFormEvent.reason}
						onChange={e => setNewFormEvent({ ...newFormEvent, reason: e.target.value })}
					/>
					{/* <select value={newFormEvent.type} onChange={e => setNewFormEvent({ ...newFormEvent, type: e.target.value })}>
					{appointmentTypes.map(el => {
						return <option key={el.value}>{el.label}</option>;
					})}
					placeholder="Select appointment type"
				</select> */}
					<Select
						value={selectedOption}
						onChange={setSelectedOption}
						options={appointmentTypes}
						placeholder="Add appointment type"
					/>

					<DatePicker
						className="datepick"
						placeholderText="Date"
						style={{ marginRight: "10px" }}
						selected={newFormEvent.date}
						onChange={date => setNewFormEvent({ ...newFormEvent, date })}
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

					<input
						type="number"
						placeholder="Add number of attendies"
						style={{ width: "20%", marginRight: "10px" }}
						value={newFormEvent.attendies}
						onChange={e => setNewFormEvent({ ...newFormEvent, attendies: e.target.value })}
					/>

					{/* TABLE */}
					<TableContainer component={Paper}>
						<Table align="center" sx={{ maxWidth: 400 }} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell></TableCell>
									<TableCell>Classroom</TableCell>
									<TableCell align="right">Name</TableCell>
									<TableCell align="right">Capacity</TableCell>
									<TableCell align="right">Type</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map(row => (
									<TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
										<TableCell>
											<Checkbox
												onChange={e => {
													// setSelected({ id: row.id, selected: e.target.checked });
													setNewFormEvent({ ...newFormEvent, classroom: { id: row.id, selected: e.target.checked } });
												}}
											/>
										</TableCell>

										<TableCell component="th" scope="row">
											{row.id}
										</TableCell>
										<TableCell align="right">{row.name}</TableCell>
										<TableCell align="right">{row.capacity}</TableCell>
										<TableCell align="right">{row.type}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<button stlye={{ marginTop: "10px" }} onClick={handleAddEvent}>
						Add Event
					</button>
				</PopUp>

				{/* <BasicTable selectedId={newFormEvent.classroom} /> */}
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
