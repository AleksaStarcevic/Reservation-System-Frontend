import React, { useContext, useEffect, useState } from "react";
import AuthContext from "./context/AuthProvider";
import axios from "./api/axios";
import MyImage from "./avatar.png";

function AccountPage() {
	const { auth } = useContext(AuthContext);
	const [user, setUser] = useState({});
	const [values, setValues] = useState({
		email: "",
		password: "",
	});
	const [changeEmail, setChangeEmail] = useState(false);
	const [changePassword, setChangePassword] = useState(false);

	useEffect(() => {
		const fetchUserDetails = async () => {
			try {
				let response = await axios.get(`/user`, {
					headers: { Authorization: `Bearer ${auth.token}` },
				});

				setUser(response.data);
			} catch (err) {
				console.log(err);
			}
		};

		fetchUserDetails();
	}, []);

	async function handleChange() {
		const email = {
			email: values.email,
		};

		try {
			let response = await axios.post(`/user/email/reset`, email, {
				headers: { Authorization: `Bearer ${auth.token}` },
			});

			if (response.status === 200) {
				alert("Success!");
			}
		} catch (err) {
			console.log(err);
		}

		setChangeEmail(false);
	}

	async function handleChangePassword() {
		const passwordObj = {
			password: values.password,
		};

		try {
			let response = await axios.post(`/user/password/reset`, passwordObj, {
				headers: { Authorization: `Bearer ${auth.token}` },
			});

			if (response.status === 200) {
				alert("Success!");
			}
		} catch (err) {
			console.log(err);
		}

		setChangePassword(false);
	}

	console.log(values);
	return (
		<div className="container">
			<div className="card_item" key={user.firstName}>
				<div className="card_inner">
					<img src={MyImage} alt="" />
					<div className="userName">{`${user.firstName} ${user.lastName}`}</div>
					<div className="userUrl">{user.typeName}</div>
					<button className="seeMore" onClick={() => setChangePassword(true)}>
						Reset password
					</button>
					<button className="seeMore" onClick={() => setChangeEmail(true)}>
						Reset email
					</button>

					{changeEmail && (
						<div className="toChange">
							<label>Enter new email:</label>
							<input
								type="email"
								pattern="^[w-.]+@([w-]+.)+[w-]{2,4}$"
								value={values.email}
								onChange={e => setValues({ ...values, email: e.target.value })}
							/>
							<button onClick={() => handleChange()}>Reset</button>
							<div className="err">Email must be valid!</div>
						</div>
					)}
					{changePassword && (
						<div className="toChange">
							<label>Enter new password:</label>
							<input
								type="password"
								pattern="^(?=.*?[0-9]).{4,}$"
								value={values.password}
								onChange={e => setValues({ ...values, password: e.target.value })}
							/>
							<button onClick={() => handleChangePassword()}>Reset</button>
							<div className="err">Password length must be at least 4 and include at least 1 number</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
export default AccountPage;
