import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Checkbox, FormControlLabel } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

import FormControl from "@mui/material/FormControl";

export default function DataTable(props) {
	const { rows, setNewFormEvent, newFormEvent } = props;

	return (
		<TableContainer>
			<Table align="center" sx={{ maxWidth: 400 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell></TableCell>
						<TableCell>Classroom</TableCell>
						<TableCell align="right">Name</TableCell>
						<TableCell align="right">Capacity</TableCell>
						<TableCell align="right">Type</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{/* {!rows.length && */}
					{rows.map(row => (
						<TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
							<TableCell>
								{/* <Checkbox
									checked={newFormEvent.classroom.id === row.id ? true : false}
									onChange={e => {
										// setSelected({ id: row.id, selected: e.target.checked });
										setNewFormEvent({
											...newFormEvent,
											classroom: { id: row.id, name: row.name, selected: e.target.checked },
										});
									}}
								/> */}

								<Radio
									checked={newFormEvent.classroom.id === row.id ? true : false}
									onChange={e => {
										// setSelected({ id: row.id, selected: e.target.checked });
										setNewFormEvent({
											...newFormEvent,
											classroom: { id: row.id, name: row.name, selected: e.target.checked },
										});
									}}
								/>
							</TableCell>

							<TableCell component="th" scope="row">
								{row.id}
							</TableCell>
							<TableCell align="right">{row.name}</TableCell>
							<TableCell align="right">{row.capacity}</TableCell>
							<TableCell align="right">{row.type}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
