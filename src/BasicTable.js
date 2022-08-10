import React, { useContext, useEffect, useState } from "react";
import AuthContext from "./context/AuthProvider";
import axios from "./api/axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Checkbox } from "@mui/material";

export default function BasicTable() {
	const { auth } = useContext(AuthContext);

	const [rows, setRows] = useState([]);
	const [selected, setSelected] = useState({ id: "", selected: "" });

	useEffect(() => {
		const fetchClassroomNameTypeAttendies = async () => {
			try {
				let response = await axios.get(`classroom/table`, {
					headers: { Authorization: `Bearer ${auth.token}` },
				});
				setRows(response.data);
			} catch (err) {
				console.log("ERROR!!!" + err); // not in 200
			}
		};

		fetchClassroomNameTypeAttendies();
	}, []);

	console.log(selected);

	return (
		<TableContainer component={Paper}>
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
					{rows.map(row => (
						<TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
							<TableCell>
								<Checkbox onChange={e => setSelected({ id: row.id, selected: e.target.checked })} />
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
