import React, { useContext, useEffect, useState } from "react";
import "../App.css";
import { SidebarDataAdmin } from "./SidebarData";
import { SidebarDataUser } from "./SidebarDataUser";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import axios from "../api/axios";
import avatarImage from "../avatar.png";

function Sidebar() {
	let navigate = useNavigate();
	// const { auth, setAuth } = useContext(AuthContext);
	const [authUser, setAuthUser] = useState(getInitialState);
	const [users, setUsers] = useState([]);
	const [user, setUser] = useState({});

	function getInitialState() {
		const user = localStorage.getItem("user");
		return user ? JSON.parse(user) : {};
	}

	useEffect(() => {
		const fetchPendingAppointmentsForUser = async () => {
			try {
				let response = await axios.get(`user/appointments-requested`, {
					responseType: "json",
					headers: { Authorization: `Bearer ${authUser.token}` },
				});

				setUsers(response.data);
			} catch (err) {
				console.log(err);
			}
		};

		const fetchUserDetails = async () => {
			try {
				let response = await axios.get(`/user`, {
					headers: { Authorization: `Bearer ${authUser.token}` },
				});

				setUser(response.data);
			} catch (err) {
				console.log(err);
			}
		};

		fetchPendingAppointmentsForUser();
		fetchUserDetails();
	}, []);

	function handleLink(link) {
		if (link === "/") {
			localStorage.clear();
			navigate(link);
		} else {
			navigate(link);
		}
	}

	let SidebarData = "";
	if (authUser.admin) {
		SidebarData = SidebarDataAdmin;
	} else {
		SidebarData = SidebarDataUser;
	}

	// console.log(SidebarData);

	return (
		<div className="Sidebar">
			<div className="profileImgAndUser">
				<img src={avatarImage} alt="" />
				<p className="welcomeUser">
					Welcome, {user.firstName} {user.lastName}
				</p>
			</div>
			<ul className="SidebarList">
				{SidebarData.map((el, key) => {
					return (
						<li className="row" key={key} onClick={() => handleLink(el.link)}>
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
