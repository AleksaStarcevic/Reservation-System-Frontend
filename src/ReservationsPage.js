import React, { useContext, useEffect, useState } from "react";
import AuthContext from "./context/AuthProvider";
import axios from "./api/axios";
import { useNavigate, Link } from "react-router-dom";
import avatarImage from "./avatar.png";

function ReservationsPage() {
	const { auth } = useContext(AuthContext);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		// samo ako je user admin

		const fetchPendingAppointmentsForUser = async () => {
			if (auth.admin === true) {
				try {
					let response = await axios.get(`user/appointments-requested`, {
						responseType: "json",
						headers: { Authorization: `Bearer ${auth.token}` },
					});

					setUsers(response.data);
				} catch (err) {
					console.log(err);
				}
			}
		};

		fetchPendingAppointmentsForUser();
	}, []);

	console.log(users);

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
									<span>Requests</span>
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
