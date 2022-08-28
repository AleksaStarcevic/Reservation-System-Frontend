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
import "./table.css";

export default function DataTable(props) {
	const { rows, setNewFormEvent, newFormEvent } = props;

	// console.log(`Inside table`, newFormEvent);
	return (
		<TableContainer>
			<Table className="tableData" align="center" sx={{ maxWidth: 400 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell className="th"></TableCell>
						<TableCell className="th">Classroom</TableCell>
						<TableCell className="th" align="right">
							Name
						</TableCell>
						<TableCell className="th" align="right">
							Capacity
						</TableCell>
						<TableCell className="th" align="right">
							Type
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{/* {!rows.length && */}
					{Array.isArray(rows)
						? rows.map(row => (
								<TableRow className="tr" key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
									<TableCell className="td">
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

									<TableCell className="td" component="th" scope="row">
										{row.id}
									</TableCell>
									<TableCell className="td" align="right">
										{row.name}
									</TableCell>
									<TableCell className="td" align="right">
										{row.capacity}
									</TableCell>
									<TableCell className="td" align="right">
										{row.type}
									</TableCell>
								</TableRow>
						  ))
						: null}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
