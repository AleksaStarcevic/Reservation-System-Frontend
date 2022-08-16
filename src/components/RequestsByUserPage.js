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

function RequestsByUserPage() {
	const { id } = useParams();
	const { auth } = useContext(AuthContext);
	const [rows, setRows] = useState([]);
	const [change, setChange] = useState(false);

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
	}, [change]);

	async function handleAccept(id) {
		try {
			let response = await axios.post(
				`/appointment/confirm`,
				{ id },
				{
					headers: { Authorization: `Bearer ${auth.token}` },
				}
			);

			if (response.status === 200) {
				alert("Uspesno odobren termin");
				setChange(true);
			} else {
				alert("Doslo je do greske");
			}
		} catch (err) {
			console.log(err);
		}
	}

	async function handleDecline(id) {
		try {
			let response = await axios.post(
				`/appointment/decline`,
				{ id },
				{
					headers: { Authorization: `Bearer ${auth.token}` },
				}
			);

			if (response.status === 200) {
				alert("Appointment declined!");
				setChange(true);
			} else {
				alert("Doslo je do greske");
			}
		} catch (err) {
			console.log(err);
		}
	}

	async function handleAcceptAll() {
		const ids = rows.map(el => {
			return el.id;
		});

		try {
			let response = await axios.post(`/appointment/confirm/all`, ids, {
				headers: { Authorization: `Bearer ${auth.token}` },
			});

			if (response.status === 200) {
				alert("All appointments accepted!");
				setChange(true);
			} else {
				alert("Doslo je do greske");
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
					<button onClick={() => handleAcceptAll()}>ACCEPT ALL</button>
				</Table>
			</TableContainer>
		</div>
	);
}

export default RequestsByUserPage;
