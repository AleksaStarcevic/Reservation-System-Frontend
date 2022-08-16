import React, { useContext, useEffect, useState } from "react";
import "../App.css";
import { SidebarData } from "./SidebarData";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import axios from "../api/axios";

function Sidebar() {
	let navigate = useNavigate();
	const { auth } = useContext(AuthContext);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchPendingAppointmentsForUser = async () => {
			try {
				let response = await axios.get(`user/appointments-requested`, {
					responseType: "json",
					headers: { Authorization: `Bearer ${auth.token}` },
				});
				console.log(response.data);
				setUsers(response.data);
			} catch (err) {
				console.log(err);
			}
		};

		fetchPendingAppointmentsForUser();
	}, []);

	return (
		<div className="Sidebar">
			<ul className="SidebarList">
				{SidebarData.map((el, key) => {
					return (
						<li className="row" key={key} onClick={() => navigate(el.link)}>
							{" "}
							{el.title === "Requests" ? (
								<div id="icon">
									{el.icon}
									{users.length > 0 && <span className="numOfRequests">{users.length}</span>}
								</div>
							) : (
								<div id="icon">{el.icon}</div>
							)}
							<div id="title">{el.title}</div>
						</li>
					);
				})}{" "}
			</ul>
		</div>
	);
}

export default Sidebar;
