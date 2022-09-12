import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import axios from "./api/axios";

function MyAppointments() {
	const [authUser, setAuthUser] = useState(getInitialState);
	const [appointments, setAppointments] = useState([]);

	function getInitialState() {
		const user = localStorage.getItem("user");
		const admin = JSON.parse(localStorage.getItem("admin"));

		const parseddUser = JSON.parse(user);

		return user ? { ...parseddUser, admin: admin } : {};
	}

	useEffect(() => {
		const fetchAppointmentsForUser = async () => {
			try {
				let response = await axios.get(`user/appointments`, {
					headers: { Authorization: `Bearer ${authUser.token}` },
				});
				console.log(response.data);
				setAppointments(response.data);
			} catch (err) {
				console.log(err);
			}
		};

		fetchAppointmentsForUser();
	}, []);

	return (
		<div>
			{appointments.length > 0 && (
				<TableContainer>
					<Table className="table" align="center" sx={{ maxWidth: 600 }} aria-label="simple table">
						<TableHead>
							<TableRow className="tr">
								{/* <TableCell></TableCell> */}
								<TableCell className="th">Name</TableCell>
								<TableCell className="th">Classroom</TableCell>
								<TableCell className="th">Date</TableCell>
								<TableCell className="th">Time</TableCell>
								<TableCell className="th">State</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{appointments.map(row => (
								<TableRow className="tr" key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
									<TableCell className="td">{row.appointmentName}</TableCell>
									<TableCell className="td">{row.classroomName}</TableCell>

									<TableCell className="td" align="right">
										{moment(row.date).format("YYYY-MM-DD")}
									</TableCell>
									<TableCell className="td" align="right">
										{row.start_timeInHours}h - {row.end_timeInHours}h
									</TableCell>
									<TableCell className="td">{row.state}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</div>
	);
}

export default MyAppointments;
