import React, { useContext, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Checkbox } from "@mui/material";
import moment from "moment";
import { style } from "@mui/system";

export default function BasicTable(props) {
	const {
		rows,
		setAppointmentsToReserve,
		setNewFormEvent,
		setEditButton,
		editButton,
		newFormEvent,
		appointmentsToReserve,
		handleReserve,
	} = props;

	function handleDelete(id) {
		// console.log("Before array update", rows);
		console.log("Id:", id);
		const updatedArray = rows.filter(el => el.id !== id);

		console.log("After update", updatedArray);

		setAppointmentsToReserve(updatedArray);
	}

	// function handleEdit(id) {
	// 	let obj = {};
	// 	rows.forEach(el => {
	// 		if (el.id === id) {
	// 			obj = el;
	// 		}
	// 	});
	// 	handleDelete(id);
	// 	console.log("Inside edit", obj);
	// 	setNewFormEvent(obj);
	// 	setEditButton(true);
	// 	// treba da napravim dugme sacuvaj umesto Add i da ono red sa tim idejm updajeteuje
	// 	// pronadjem u nizu objekat sa tim id i onda popunim fomru sa podacima preko propsa setPrefilledData
	// 	// napravim const [prefilledData,setprefilledDATA]=usestate({});
	// }

	function checkAvailableReservations() {
		if (appointmentsToReserve.length === 0) {
			return true; // disabled === true
		}
	}

	return (
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
							{/* <TableCell>
								{row.available === true ? (
									<button style={{ backgroundColor: "green" }}>✔</button>
								) : (
									<button style={{ backgroundColor: "red" }}>❌</button>
								)}
							</TableCell> */}
							<TableCell align="right">{row.title}</TableCell>
							<TableCell align="right">{row.classroom.name}</TableCell>

							<TableCell align="right">{moment(row.date).format("YYYY-MM-DD")}</TableCell>
							<TableCell align="right">
								{row.start} - {row.end}
							</TableCell>
							<TableCell>
								<button /*onClick={() => handleEdit(row.id)}*/>Izmeni</button>
							</TableCell>
							<TableCell>
								<button onClick={() => handleDelete(row.id)}>Obrisi</button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<button onClick={() => handleReserve()} disabled={checkAvailableReservations()}>
				Posalji na odobravanje
			</button>
		</TableContainer>
	);
}
