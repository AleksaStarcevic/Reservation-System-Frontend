import { React, useContext, useState } from "react";
import Select from "react-select";
import DataTable from "./components/DataTable";
import DatePicker from "react-datepicker";
import AuthContext from "./context/AuthProvider";
import axios from "./api/axios";
import moment from "moment";

function AppointmentDetails(props) {
	const { appointmentDetails, setAppointmentDetails, appointmentTypes, rows, setOpenPopup } = props;
	const { auth } = useContext(AuthContext);
	const [editOn, setEditOn] = useState(false);

	async function handleDelete(id) {
		try {
			let response = await axios.delete(`/appointment?id=${id}`, {
				headers: { Authorization: `Bearer ${auth.token}` },
			});

			if (response.status === 200) {
				alert("Appointment deleted");
				setOpenPopup(false);
			}
		} catch (err) {
			console.log(err);
		}
	}

	function openForm() {
		setEditOn(true);
	}

	async function handleEdit() {
		let dateFormated = moment(appointmentDetails.date).format("YYYY-MM-DD");

		const objectForUpdate = {
			id: appointmentDetails.id,
			classroomId: appointmentDetails.classroom.id,
			name: appointmentDetails.title,
			date: dateFormated,
			decription: appointmentDetails.desc,
			reason: appointmentDetails.reason,
			number_of_attendies: parseInt(appointmentDetails.attendies),
			start_timeInHours: parseInt(appointmentDetails.start),
			end_timeInHours: parseInt(appointmentDetails.end),
			type: appointmentDetails.type.value,
		};

		try {
			let response = await axios.patch(`/appointment`, objectForUpdate, {
				headers: { Authorization: `Bearer ${auth.token}` },
			});

			if (response.status === 200) {
				alert("Appointment successfully edited");
				setEditOn(false);
			}
		} catch (err) {
			alert(err.response.data);
		}
	}
	console.log(appointmentDetails);
	return (
		<>
			<div className="container">
				<div className="card_item">
					<div className="card_inner">
						<div className="userName">
							<p>Name: {appointmentDetails.title}</p>
							<p>Classroom: {appointmentDetails.classroom.name}</p>
							<p>Date: {moment(appointmentDetails.date).format("YYYY-MM-DD")}</p>
							<p>
								Time: {appointmentDetails.start}-{appointmentDetails.end}
							</p>

							<p>Description:{appointmentDetails.desc}</p>
							<p>Reason:{appointmentDetails.reason}</p>
							<p>Attendies:{appointmentDetails.attendies}</p>
							<p>Appointment type:{appointmentDetails.type.label}</p>
							<div className="detailsButton">
								<button onClick={() => openForm()} className="seeMore">
									{" "}
									Edit
								</button>
								<button className="seeMore" onClick={() => handleDelete(appointmentDetails.id)}>
									{" "}
									Delete
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			{editOn && (
				<div className="laga">
					<input
						type="text"
						placeholder="Add Title"
						style={{ width: "20%", marginRight: "10px" }}
						value={appointmentDetails.title}
						onChange={e => setAppointmentDetails({ ...appointmentDetails, title: e.target.value })}
					/>
					<input
						type="text"
						placeholder="Add Desc"
						style={{ width: "20%", marginRight: "10px" }}
						value={appointmentDetails.desc}
						onChange={e => setAppointmentDetails({ ...appointmentDetails, desc: e.target.value })}
					/>
					<input
						type="text"
						placeholder="Add Reason"
						style={{ width: "20%", marginRight: "10px" }}
						value={appointmentDetails.reason}
						onChange={e => setAppointmentDetails({ ...appointmentDetails, reason: e.target.value })}
					/>
					<Select
						value={appointmentDetails.type}
						onChange={e => setAppointmentDetails({ ...appointmentDetails, type: e })}
						options={appointmentTypes}
						placeholder="Add appointment type"
					/>

					<DatePicker
						className="datepick"
						placeholderText="Date"
						style={{ marginRight: "10px" }}
						selected={appointmentDetails.date}
						onChange={date => setAppointmentDetails({ ...appointmentDetails, date })}
					/>
					<input
						type="time"
						step="3600"
						placeholder="Add start time"
						style={{ width: "20%", marginRight: "10px" }}
						value={appointmentDetails.start}
						onChange={e => setAppointmentDetails({ ...appointmentDetails, start: e.target.value })}
					/>
					<input
						type="time"
						step="3600"
						placeholder="Add end time"
						style={{ width: "20%", marginRight: "10px" }}
						value={appointmentDetails.end}
						onChange={e => setAppointmentDetails({ ...appointmentDetails, end: e.target.value })}
					/>

					<input
						type="number"
						placeholder="Add number of attendies"
						style={{ width: "20%", marginRight: "10px" }}
						value={appointmentDetails.attendies}
						onChange={e => setAppointmentDetails({ ...appointmentDetails, attendies: e.target.value })}
					/>

					{/* TABLE */}
					<DataTable rows={rows} setNewFormEvent={setAppointmentDetails} newFormEvent={appointmentDetails} />
					<button onClick={() => handleEdit()}>Edit event</button>
				</div>
			)}
		</>
	);
}

export default AppointmentDetails;
