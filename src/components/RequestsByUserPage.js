import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import axios from "../api/axios";

function RequestsByUserPage() {
	const { id } = useParams();
	const { auth } = useContext(AuthContext);

	useEffect(() => {
		const fetchPendingAppointmentsForUser = async () => {
			try {
				let response = await axios.get(`user/appointments/pending?id=${id}`, {
					headers: { Authorization: `Bearer ${auth.token}` },
				});

				console.log(response.data);
			} catch (err) {
				console.log(err);
			}
		};

		fetchPendingAppointmentsForUser();
	}, []);
	return <div>RequestsByUserPage - {id}</div>;
}

export default RequestsByUserPage;
