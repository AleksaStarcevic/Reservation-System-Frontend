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
import BasicTable from "./components/BasicTable";
import DataTable from "./components/DataTable";
import { set } from "date-fns";
import AppointmentDetails from "./AppointmentDetails";

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

	let startObject = {
		id: Math.floor(Math.random() * 10000),
		title: "",
		desc: "",
		reason: "",
		date: "",
		start: "",
		end: "",
		attendies: "",
		type: {
			label: "",
			value: "",
		},
		classroom: {
			id: "",
			name: "",
			selected: "", // classroom kao niz idjeva ne treba mi slected na osnovu selecteda izvlacim idjeve
		}, // ovo kao niz da uzmem sve ucionice
	};

	const [newFormEvent, setNewFormEvent] = useState(startObject);

	const [allEvents, setAllEvents] = useState([]);
	const [classroomTypes, setClassroomTypes] = useState([]);
	const [appointmentTypes, setAppointmentTypes] = useState([]);

	//Tabela
	const [rows, setRows] = useState([]);

	const [appointmentsToReserve, setAppointmentsToReserve] = useState([]);
	const [openPopup, setOpenPopup] = useState(false);
	const [dataChanged, setDataChanged] = useState(false);
	const [editButton, setEditButton] = useState(false);
	const [openDetailsPopup, setOpenDetailsPopup] = useState(false);
	const [appointmentDetails, setAppointmentDetails] = useState(startObject);

	useEffect(() => {
		console.log("IN useEffect!");

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

				console.log(resourceMap);

				setClassroomTypes(resourceMap);
			} catch (err) {
				console.log(err);
			}
		};

		const fetchAppointments = async () => {
			// ovde treba samo oni koji su accepted
			try {
				// var date1 = new Date("2022, 06, 22");
				// var dateFormat = moment(date1).format("YYYY-MM-DD");
				// const response = await axios.post(`/appointment/${dateFormat}`,{},{ headers: { Authorization: `Bearer ${auth.token}` } });

				let response = await axios.get(`/appointment`, { headers: { Authorization: `Bearer ${auth.token}` } });

				const appointments = response.data;
				const newAr = [];
				// transformacija niza iz baze u niz za prikaz
				if (Array.isArray(appointments)) {
					appointments.forEach(el => {
						const dates = el.date.split("-");
						if (el.status.id === 1) {
							newAr.push({
								id: el.id,
								start: new Date(dates[0], dates[1] - 1, dates[2], el.start_timeInHours, 0, 0),
								end: new Date(dates[0], dates[1] - 1, dates[2], el.end_timeInHours, 0, 0),
								title: el.name,
								resourceId: el.classroom.id,
							});
						}
					});
				}

				setAllEvents(newAr);
			} catch (err) {
				console.log(err);
			}
		};

		const fetchClassroomNameTypeAttendies = async () => {
			try {
				let response = await axios.get(`classroom/table`, {
					headers: { Authorization: `Bearer ${auth.token}` },
				});
				setRows(response.data);
			} catch (err) {
				console.log(err);
			}
		};

		const fetchAppointmentTypes = async () => {
			try {
				let response = await axios.get(`common/appointment/types`, {
					headers: { Authorization: `Bearer ${auth.token}` },
				});
				let ar = [];
				// if (!response.data.length) {

				if (Array.isArray(response.data)) {
					ar = response.data.map(el => {
						return { label: el.name, value: el.id };
					});
				}

				setAppointmentTypes(ar);
			} catch (err) {
				console.log(err);
			}
		};

		fetchClassroomTypes();
		fetchAppointments();
		fetchClassroomNameTypeAttendies();
		fetchAppointmentTypes();
	}, [openPopup, openDetailsPopup]);

	// console.log(newFormEvent);

	async function handleReserve() {
		let dateFormated = moment(newFormEvent.date).format("YYYY-MM-DD");

		const arrayOfBojects = appointmentsToReserve.map(el => {
			return {
				email: auth.email,
				classroomId: el.classroom.id,
				name: el.title,
				date: dateFormated,
				decription: el.desc,
				reason: el.reason,
				number_of_attendies: parseInt(el.attendies),
				start_timeInHours: parseInt(el.start),
				end_timeInHours: parseInt(el.end),
				type: el.type,
			};
		});

		console.log(`BOHECTSL`);
		console.log(arrayOfBojects);

		try {
			let response = await axios.post(`appointment/reserve`, arrayOfBojects, {
				headers: { Authorization: `Bearer ${auth.token}` },
			});

			if (response.status === 200) {
				alert("Uspesno rezervisani termini");
			} else {
				alert("Doslo je do greske");
			}
		} catch (err) {
			console.log(err); // not in 200
		}
		setAppointmentsToReserve([]);
		setNewFormEvent(startObject);
	}

	function checkForReserveConflict() {
		for (let i = 0; i < appointmentsToReserve.length; i++) {
			if (
				appointmentsToReserve[i].date === newFormEvent.date &&
				appointmentsToReserve[i].classroom.name === newFormEvent.classroom.name &&
				((appointmentsToReserve[i].start <= newFormEvent.start && appointmentsToReserve[i].end >= newFormEvent.end) ||
					(appointmentsToReserve[i].start >= newFormEvent.start &&
						appointmentsToReserve[i].start < newFormEvent.end &&
						appointmentsToReserve[i].end >= newFormEvent.end) ||
					(appointmentsToReserve[i].start <= newFormEvent.start &&
						appointmentsToReserve[i].end > newFormEvent.start &&
						appointmentsToReserve[i].end <= newFormEvent.end) ||
					(appointmentsToReserve[i].start >= newFormEvent.start && appointmentsToReserve[i].end <= newFormEvent.end))
			) {
				return true;
			}
		}
		return false;
	}

	const isClassroomAvailableForDate = async () => {
		let dateFormated = moment(newFormEvent.date).format("YYYY-MM-DD");
		const obj = {
			date: dateFormated,
			classroomId: newFormEvent.classroom.id,
			start_timeInHours: parseInt(newFormEvent.start),
			end_timeInHours: parseInt(newFormEvent.end),
		};

		try {
			let response = await axios.post(`appointment/available`, obj, {
				headers: { Authorization: `Bearer ${auth.token}` },
			});
			const entry = checkForReserveConflict();
			console.log(entry);

			if (response.data === true && entry === false) {
				setAppointmentsToReserve([
					...appointmentsToReserve,
					{ ...newFormEvent, available: response.data, id: Math.floor(Math.random() * 10000) },
				]);
				// setDataChanged(true);
			} else {
				// setNewFormEvent(newFormEvent);
				console.log(`Appointment in selected classroom is reserved`);
			}

			// console.log("avail", newFormEvent);
		} catch (err) {
			console.log(err);
		}
	};

	function handleAddingAppointments(e) {
		e.preventDefault();

		isClassroomAvailableForDate();
		// setNewFormEvent(startObject);
		// resetuj niz, formu i tabelu
		setAppointmentsToReserve([]);
	}

	function handleEditAppointment(e) {
		e.preventDefault();

		isClassroomAvailableForDate();
		setEditButton(false);
		// setNewFormEvent(startObject);
	}

	// console.log("After render", newFormEvent);
	console.log("AFter render", appointmentsToReserve);

	async function getAppointmentDetails(id) {
		try {
			let response = await axios.get(`appointment/details?id=${id}`, {
				headers: { Authorization: `Bearer ${auth.token}` },
			});

			setAppointmentDetails({
				id: response.data.id,
				title: response.data.name,
				desc: response.data.decription,
				reason: response.data.reason,
				date: new Date(response.data.date),
				start: response.data.start_timeInHours + ":00",
				end: response.data.end_timeInHours + ":00",
				attendies: response.data.number_of_attendies,
				type: {
					label: response.data.type.name,
					value: response.data.type.id,
				},
				classroom: {
					id: response.data.classroomId,
					name: response.data.classroomName,
				},
			});
		} catch (err) {
			console.log(err);
		}
	}

	function handleSelectEvent(e) {
		setOpenDetailsPopup(true);
		// setAppointmentDetails(e);
		// izvucem id i na osnovu njega dobijem appointment details
		getAppointmentDetails(e.id);
	}

	console.log("mrs", appointmentDetails);
	console.log("Popup", openDetailsPopup);

	return (
		<div>
			{/* Ovaj div u novu komponentu */}
			<div className="aa">
				<div className="dugmad">
					<button onClick={() => setOpenPopup(true)}>Dodaj dogadjaj</button>
				</div>
			</div>

			<PopUp title="Add appointment" openPopup={openPopup} setOpenPopup={setOpenPopup}>
				<div className="laga">
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
						value={newFormEvent.type.label}
						onChange={e => setNewFormEvent({ ...newFormEvent, type: e.value })}
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
						step="3600"
						type="time"
						placeholder="Add start time"
						style={{ width: "20%", marginRight: "10px" }}
						value={newFormEvent.start}
						onChange={e => setNewFormEvent({ ...newFormEvent, start: e.target.value })}
					/>
					<input
						step="3600"
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
					<DataTable rows={rows} setNewFormEvent={setNewFormEvent} newFormEvent={newFormEvent} />

					{editButton === true ? (
						<button onClick={handleEditAppointment}>Edit event</button>
					) : (
						<button style={{ marginTop: "10px" }} onClick={handleAddingAppointments}>
							Add event
						</button>
					)}
					{/* <button  style={{ marginTop: "10px" }} onClick={handleAddingAppointments}>
						Add Event
					</button> */}
				</div>
				{/* Tabela gde punim dodate termine  */}
				<div>
					<BasicTable
						rows={appointmentsToReserve}
						setAppointmentsToReserve={setAppointmentsToReserve}
						setNewFormEvent={setNewFormEvent}
						setEditButton={setEditButton}
						editButton={editButton}
						newFormEvent={newFormEvent}
						appointmentsToReserve={appointmentsToReserve}
						handleReserve={handleReserve}
					/>
				</div>
			</PopUp>

			<Calendar
				localizer={localizer}
				events={allEvents}
				startAccessor="start"
				endAccessor="end"
				style={{ height: 1200, marginLeft: "220px" }}
				resourceIdAccessor="resourceId"
				resources={classroomTypes}
				resourceTitleAccessor="resourceTitle"
				popup
				onSelectEvent={handleSelectEvent}
			/>

			{/* PopUp for event details */}
			{openDetailsPopup && (
				<div className="">
					<PopUp title="Details" openPopup={openDetailsPopup} setOpenPopup={setOpenDetailsPopup}>
						<AppointmentDetails
							appointmentDetails={appointmentDetails}
							setAppointmentDetails={setAppointmentDetails}
							appointmentTypes={appointmentTypes}
							rows={rows}
							setOpenPopup={setOpenDetailsPopup}
						/>
					</PopUp>
				</div>
			)}
		</div>
	);
}

export default MainPage;
