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

function RequestsByUserPage() {
	const { id } = useParams();
	const { auth } = useContext(AuthContext);
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

	useEffect(() => {
		const fetchPendingAppointmentsForUser = async () => {
			try {
				let response = await axios.get(`user/appointments/pending?id=${id}`, {
					headers: { Authorization: `Bearer ${auth.token}` },
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
					headers: { Authorization: `Bearer ${auth.token}` },
				}
			);

			setLoading(false);

			if (response.status === 200) {
				notifyInfo("Appointment accepted");
				setDataChanged(prev => !prev);
			} else {
				notifyError("Error!");
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
					headers: { Authorization: `Bearer ${auth.token}` },
				}
			);

			setLoading(false);

			if (response.status === 200) {
				notifyInfo("Appointment declined");
				setDataChanged(prev => !prev);
			} else {
				notifyError("Error!");
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
				headers: { Authorization: `Bearer ${auth.token}` },
			});

			setLoading(false);
			if (response.status === 200) {
				notifyInfo("All appointments accepted");
				setDataChanged(prev => !prev);
			} else {
				notifyError("Error!");
			}
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<div>
			<TableContainer>
				<Table align="center" sx={{ maxWidth: 400 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							{/* <TableCell></TableCell> */}
							<TableCell>Name</TableCell>
							<TableCell align="right">Classroom</TableCell>
							<TableCell align="right">Date</TableCell>
							<TableCell align="right">Time</TableCell>
							<TableCell></TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map(row => (
							<TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
								<TableCell align="right">{row.title}</TableCell>
								<TableCell align="right">{row.classroomName}</TableCell>

								<TableCell align="right">{moment(row.date).format("YYYY-MM-DD")}</TableCell>
								<TableCell align="right">
									{row.startTime}h - {row.endTime}h
								</TableCell>
								<TableCell>
									<button onClick={() => handleAccept(row.id)} style={{ backgroundColor: "green" }}>
										{" "}
										ACCEPT ✔
									</button>
								</TableCell>
								<TableCell>
									<button onClick={() => handleDecline(row.id)} style={{ backgroundColor: "red" }}>
										DECLINE ❌
									</button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<button onClick={() => handleAcceptAll()}>ACCEPT ALL</button>
			{loading && (
				<Backdrop sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
					<CircularProgress color="inherit" />
				</Backdrop>
			)}
		</div>
	);
}

export default RequestsByUserPage;
