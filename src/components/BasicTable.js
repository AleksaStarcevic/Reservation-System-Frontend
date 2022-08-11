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
	const { rows } = props;

	return (
		<TableContainer component={Paper}>
			<Table align="center" sx={{ maxWidth: 400 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell></TableCell>
						<TableCell>Name</TableCell>
						<TableCell align="right">Classroom</TableCell>
						<TableCell align="right">Date</TableCell>
						<TableCell align="right">Time</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map(row => (
						<TableRow key={Math.floor(Math.random() * 1000)} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
							<TableCell>
								<button style={row.available === true ? { backgroundColor: "green" } : { backgroundColor: "red" }}>
									X
								</button>
							</TableCell>
							<TableCell align="right">{row.title}</TableCell>
							<TableCell align="right">{row.classroom.name}</TableCell>

							<TableCell align="right">{moment(row.date).format("YYYY-MM-DD")}</TableCell>
							<TableCell align="right">
								{row.start} - {row.end}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
