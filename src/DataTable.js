import React, { useContext, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import AuthContext from "./context/AuthProvider";
import axios from "./api/axios";

export default function DataTable() {
	const { auth } = useContext(AuthContext);

	const columns = [
		{ field: "id", headerName: "Classroom", width: 130 },
		{ field: "name", headerName: "Name", width: 130 },
		{ field: "capacity", headerName: "Capacity", width: 130 },
		{ field: "type", headerName: "Type", width: 130 },
	];

	const [rows, setRows] = useState([]);

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

	return (
		<div style={{ height: 400, width: "100%" }}>
			<DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5]} checkboxSelection />
		</div>
	);
}
