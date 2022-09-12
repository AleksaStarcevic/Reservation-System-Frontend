import React, { useContext, useEffect, useState } from "react";
import AuthContext from "./context/AuthProvider";
import axios from "./api/axios";
import { useNavigate, Link } from "react-router-dom";
import avatarImage from "./avatar.png";

function ReservationsPage() {
	// const { auth } = useContext(AuthContext);
	const [authUser, setAuthUser] = useState(getInitialState);
	const [users, setUsers] = useState([]);

	function getInitialState() {
		const user = localStorage.getItem("user");
		return user ? JSON.parse(user) : {};
	}

	useEffect(() => {
		// samo ako je user admin

		const fetchPendingAppointmentsForUser = async () => {
			try {
				let response = await axios.get(`user/appointments-requested`, {
					responseType: "json",
					headers: { Authorization: `Bearer ${authUser.token}` },
				});
				console.log(response.data);
				setUsers(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		if (authUser.admin === true) {
			fetchPendingAppointmentsForUser();
		}
	}, []);

	return (
		<div className="container">
			{users.map(el => {
				return (
					<div className="card_item" key={el.id}>
						<div className="card_inner">
							<img src={avatarImage} alt="" />
							<div className="userName">{`${el.firstName} ${el.lastName}`}</div>
							<div className="userUrl">{el.type}</div>
							<div className="detail-box">
								<div className="gitDetail">
									<span style={{ background: "#02a186" }}>Requests</span>
									{el.number_of_requests}
								</div>
							</div>
							<button className="seeMore">
								{" "}
								<Link className="linkSee" to={`/user/reservations/pending/${el.id}`}>
									See More
								</Link>
							</button>
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default ReservationsPage;
