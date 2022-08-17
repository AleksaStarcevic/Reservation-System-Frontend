import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "./api/axios";
import AuthContext from "./context/AuthProvider";
import FormInput from "./components/FormInput";
import "./login.css";

function Login() {
	const { setAuth } = useContext(AuthContext); // postavljanje globalnog korisnika

	let navigate = useNavigate();
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);

	const [values, setValues] = useState({
		username: "",
		password: "",
	});

	const inputs = [
		{
			id: 1,
			name: "username",
			type: "text",
			placeholder: "Username",
			label: "Username",
			required: true,
		},

		{
			id: 2,
			name: "password",
			type: "password",
			placeholder: "Password",
			label: "Password",
			required: true,
		},
	];

	const onChange = e => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	async function handleSubmit(e) {
		e.preventDefault();
		setValues({
			username: "",
			password: "",
		});

		try {
			const response = await axios.post(
				"/login",
				new URLSearchParams({
					username: values.username,
					password: values.password,
				}), // username kao za dto
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				}
			);

			if (response.headers.validationtoken) {
				const accessToken = response?.headers?.validationtoken;
				setAuth({ email: values.username, token: accessToken });
				setSuccess(true);
			} else {
				setError(true);
			}
		} catch (err) {}
	}

	return (
		<>
			{success ? (
				navigate("/main")
			) : (
				<div className="app">
					<form onSubmit={handleSubmit}>
						<h1>Login</h1>
						{inputs.map(input => (
							<FormInput key={input.id} {...input} value={values[input.name]} onChange={onChange} />
						))}
						{error && <p className="error">Invalid username or password!</p>}
						<button>Submit</button>

						<p>
							Need acount?
							<span>
								<Link to="signup">Sign up</Link>
							</span>
						</p>
					</form>
				</div>
			)}
		</>
	);
}

export default Login;
