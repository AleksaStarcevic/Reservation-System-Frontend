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
		auth,
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
			<Table className="tableBasic" align="center" sx={{ maxWidth: 400 }} aria-label="simple table">
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
						<TableCell className="th"></TableCell>
						<TableCell className="th"></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map(row => (
						<TableRow className="tr" key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
							{/* <TableCell>
								{row.available === true ? (
									<button style={{ backgroundColor: "green" }}>✔</button>
								) : (
									<button style={{ backgroundColor: "red" }}>❌</button>
								)}
							</TableCell> */}
							<TableCell className="td" align="right">
								{row.title}
							</TableCell>
							<TableCell className="td" align="right">
								{row.classroom.name}
							</TableCell>

							<TableCell className="td" align="right">
								{moment(row.date).format("YYYY-MM-DD")}
							</TableCell>
							<TableCell className="td" align="right">
								{row.start} - {row.end}
							</TableCell>

							<TableCell className="td">
								<button className="deleteBtn" onClick={() => handleDelete(row.id)}>
									Obrisi
								</button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{appointmentsToReserve.length > 0 && (
				<button className="reserveBtn" onClick={() => handleReserve()}>
					{auth.admin === true ? "Reserve" : "Send for approval"}
				</button>
			)}
		</TableContainer>
	);
}
