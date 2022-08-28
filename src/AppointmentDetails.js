import { React, useContext, useState } from "react";
import Select from "react-select";
import DataTable from "./components/DataTable";
import DatePicker from "react-datepicker";
import AuthContext from "./context/AuthProvider";
import axios from "./api/axios";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppointmentDetails(props) {
	const { appointmentDetails, setAppointmentDetails, appointmentTypes, rows, setOpenPopup } = props;
	// const { auth } = useContext(AuthContext);
	const [authUser, setAuthUser] = useState(getInitialState);
	const [editOn, setEditOn] = useState(false);

	function getInitialState() {
		const user = localStorage.getItem("user");
		const admin = JSON.parse(localStorage.getItem("admin"));

		const parseddUser = JSON.parse(user);

		return user ? { ...parseddUser, admin: admin } : {};
	}

	const notifyError = text => {
		toast.error(text, {
			position: "bottom-center",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	};
	const notifySuccess = text => {
		toast.success(text, {
			position: "bottom-center",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	};

	async function handleDelete(id) {
		try {
			let response = await axios.delete(`/appointment?id=${id}`, {
				headers: { Authorization: `Bearer ${authUser.token}` },
			});

			if (response.status === 200) {
				notifySuccess("Appointment successfully deleted");
				setOpenPopup(false);
			}
		} catch (err) {
			notifyError("Error");
		}
	}

	function openForm() {
		setEditOn(true);
	}

	async function handleEdit() {
		if (
			appointmentDetails.title === "" ||
			appointmentDetails.desc === "" ||
			appointmentDetails.reason === "" ||
			appointmentDetails.date === "" ||
			appointmentDetails.classroom.name === "" ||
			appointmentDetails.type.label === "" ||
			appointmentDetails.start === "" ||
			appointmentDetails.end === "" ||
			appointmentDetails.attendies === ""
		) {
			notifyError("All fields must be filled!");
			return;
		}

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
				headers: { Authorization: `Bearer ${authUser.token}` },
			});

			if (response.status === 200) {
				notifySuccess("Appointment successfully edited");
				setEditOn(false);
			}
		} catch (err) {
			notifyError("Appointment in the given classroom at the given time is already reserved");
		}
	}
	console.log(appointmentDetails);
	return (
		<>
			<div className="popupDiv">
				<div className={editOn ? "containerWithoutFlex" : "container"}>
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
						<div className="appDetails">
							<div className="formRow">
								<span className="details">Title*</span>
								<input
									type="text"
									placeholder="Add Title"
									style={{ width: "20%", marginRight: "10px" }}
									value={appointmentDetails.title}
									onChange={e => setAppointmentDetails({ ...appointmentDetails, title: e.target.value })}
								/>
							</div>

							<div className="formRow">
								<span className="details">Reason*</span>
								<input
									type="text"
									placeholder="Add Reason"
									style={{ width: "20%", marginRight: "10px" }}
									value={appointmentDetails.reason}
									onChange={e => setAppointmentDetails({ ...appointmentDetails, reason: e.target.value })}
								/>
							</div>

							<div className="formRow">
								<span className="details">Description*</span>
								<input
									type="text"
									placeholder="Add Desc"
									style={{ width: "20%", marginRight: "10px" }}
									value={appointmentDetails.desc}
									onChange={e => setAppointmentDetails({ ...appointmentDetails, desc: e.target.value })}
								/>
							</div>

							<div className="formRow">
								<span className="details">Attendies*</span>
								<input
									type="number"
									placeholder="Add number of attendies"
									style={{ width: "20%", marginRight: "10px" }}
									value={appointmentDetails.attendies}
									onChange={e => setAppointmentDetails({ ...appointmentDetails, attendies: e.target.value })}
								/>
								{appointmentDetails.attendies > 0 || appointmentDetails.attendies === "" ? (
									""
								) : (
									<span className="sp6" style={{ display: "block" }}>
										Number of attendies must be greater than 0
									</span>
								)}
							</div>

							<div className="formRow">
								<span className="details">Date*</span>
								<DatePicker
									className="datepick"
									placeholderText="Date"
									style={{ marginRight: "10px" }}
									selected={appointmentDetails.date}
									onChange={date => setAppointmentDetails({ ...appointmentDetails, date })}
								/>
							</div>

							<div className="formRow">
								<span className="details">Type*</span>
								<Select
									value={appointmentDetails.type}
									onChange={e => setAppointmentDetails({ ...appointmentDetails, type: e })}
									options={appointmentTypes}
									placeholder="Add appointment type"
								/>
							</div>

							<div className="formRow">
								<span className="details">Start time*</span>
								<input
									min="08:00"
									max="20:00"
									type="time"
									step="3600"
									placeholder="Add start time"
									style={{ width: "20%", marginRight: "10px" }}
									value={appointmentDetails.start}
									onChange={e => setAppointmentDetails({ ...appointmentDetails, start: e.target.value })}
								/>
								{(parseInt(appointmentDetails.start) >= 8 && parseInt(appointmentDetails.start) < 20) ||
								appointmentDetails.start === "" ? (
									""
								) : (
									<span className="sp4" style={{ display: "block" }}>
										Start time must must be between 8:00 h and 19:00h
									</span>
								)}
							</div>

							<div className="formRow">
								<span className="details">End time*</span>
								<input
									min="08:00"
									max="20:00"
									type="time"
									step="3600"
									placeholder="Add end time"
									style={{ width: "20%", marginRight: "10px" }}
									value={appointmentDetails.end}
									onChange={e => setAppointmentDetails({ ...appointmentDetails, end: e.target.value })}
								/>
								{(parseInt(appointmentDetails.end) > parseInt(appointmentDetails.start) &&
									parseInt(appointmentDetails.end) <= 20) ||
								appointmentDetails.end === "" ? (
									""
								) : (
									<span className="sp5" style={{ display: "block" }}>
										End time must be between start time and 20:00h
									</span>
								)}
							</div>

							{/* TABLE */}
							<div className="roomsBtnEdit">
								<DataTable rows={rows} setNewFormEvent={setAppointmentDetails} newFormEvent={appointmentDetails} />
								<button className="btnAddEventEdit" onClick={() => handleEdit()}>
									Edit event
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}

export default AppointmentDetails;
