import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import axios from "../api/axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "./table.css";

function RequestsByUserPage() {
	const { id } = useParams();
	// const { auth } = useContext(AuthContext);
	const [authUser, setAuthUser] = useState(getInitialState);
	const [rows, setRows] = useState([]);
	const [dataChanged, setDataChanged] = useState(false);
	const [loading, setLoading] = useState(false);

	const notifyInfo = text => {
		toast.info(text, {
			position: "bottom-center",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	};

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

	function getInitialState() {
		const user = localStorage.getItem("user");
		return user ? JSON.parse(user) : {};
	}

	useEffect(() => {
		const fetchPendingAppointmentsForUser = async () => {
			try {
				let response = await axios.get(`user/appointments/pending?id=${id}`, {
					headers: { Authorization: `Bearer ${authUser.token}` },
				});

				setRows(response.data);
			} catch (err) {
				console.log(err);
			}
		};

		fetchPendingAppointmentsForUser();
	}, [dataChanged]);

	async function handleAccept(id) {
		setLoading(prev => !prev);
		try {
			let response = await axios.post(
				`/appointment/confirm`,

				{ id },
				{
					headers: { Authorization: `Bearer ${authUser.token}` },
				}
			);

			setLoading(false);

			if (response.status === 200) {
				notifyInfo("Appointment accepted");
				setDataChanged(prev => !prev);
			} else {
				notifyError("Error, failed to accept appointment !");
			}
		} catch (err) {
			console.log(err);
		}
	}

	async function handleDecline(id) {
		setLoading(prev => !prev);
		try {
			let response = await axios.post(
				`/appointment/decline`,
				{ id },
				{
					headers: { Authorization: `Bearer ${authUser.token}` },
				}
			);

			setLoading(false);

			if (response.status === 200) {
				notifyInfo("Appointment declined");
				setDataChanged(prev => !prev);
			} else {
				notifyError("Error, failed to decline appointment");
			}
		} catch (err) {
			console.log(err);
		}
	}

	async function handleAcceptAll() {
		setLoading(prev => !prev);
		const ids = rows.map(el => {
			return el.id;
		});

		try {
			let response = await axios.post(`/appointment/confirm/all`, ids, {
				headers: { Authorization: `Bearer ${authUser.token}` },
			});

			setLoading(false);
			if (response.status === 200) {
				notifyInfo("All appointments accepted");
				setDataChanged(prev => !prev);
			} else {
				notifyError("Error, failed to accept all appointments !");
			}
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<div>
			{rows.length > 0 && (
				<TableContainer>
					<Table className="table" align="center" sx={{ maxWidth: 400 }} aria-label="simple table">
						<TableHead>
							<TableRow className="tr">
								{/* <TableCell></TableCell> */}
								<TableCell className="th">Name</TableCell>
								<TableCell className="th" align="right">
									Classroom
								</TableCell>
								<TableCell className="th" align="right">
									Date
								</TableCell>
								<TableCell className="th" align="right">
									Time
								</TableCell>
								<TableCell className="th">Accept</TableCell>
								<TableCell className="th">Decline</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map(row => (
								<TableRow className="tr" key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
									<TableCell className="td" align="right">
										{row.title}
									</TableCell>
									<TableCell className="td" align="right">
										{row.classroomName}
									</TableCell>

									<TableCell className="td" align="right">
										{moment(row.date).format("YYYY-MM-DD")}
									</TableCell>
									<TableCell className="td" align="right">
										{row.startTime}h - {row.endTime}h
									</TableCell>
									<TableCell className="td">
										<button className="btn" onClick={() => handleAccept(row.id)} style={{ backgroundColor: "green" }}>
											{" "}
											ACCEPT ✔
										</button>
									</TableCell>
									<TableCell className="td">
										<button className="btn" onClick={() => handleDecline(row.id)} style={{ backgroundColor: "red" }}>
											DECLINE ❌
										</button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
						<TableCell>
							<button className="btnAll" onClick={() => handleAcceptAll()}>
								ACCEPT ALL
							</button>
						</TableCell>
					</Table>
				</TableContainer>
			)}

			{loading && (
				<Backdrop sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
					<CircularProgress color="inherit" />
				</Backdrop>
			)}
		</div>
	);
}

export default RequestsByUserPage;
