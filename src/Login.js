import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "./api/axios";
import AuthContext from "./context/AuthProvider";
import FormInput from "./components/FormInput";
import "./login.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import FonImage from "./fon.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
	// const { setAuth } = useContext(AuthContext); // postavljanje globalnog korisnika

	let navigate = useNavigate();
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	const [values, setValues] = useState({
		username: "",
		password: "",
	});

	const notifySuccess = text => {
		toast.success(text, {
			position: "bottom-center",
			autoClose: 1000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	};

	const notifyError = text => {
		toast.error(text, {
			position: "bottom-center",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	};

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
		setLoading(prev => !prev);
		e.preventDefault();

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

			setLoading(false);

			if (response.headers.validationtoken) {
				const accessToken = response?.headers?.validationtoken;
				localStorage.setItem("user", JSON.stringify({ email: values.username, token: accessToken }));
				// setAuth({ email: values.username, token: accessToken });

				notifySuccess("Login successful");

				setSuccess(true);
			} else {
				setError(true);
			}
		} catch (err) {}

		setValues({
			username: "",
			password: "",
		});
	}

	return (
		<>
			{success ? (
				navigate("/main")
			) : (
				<div className="app">
					<header>
						<img src={FonImage}></img>
					</header>
					<form onSubmit={handleSubmit}>
						<h1>Login</h1>
						{inputs.map(input => (
							<FormInput key={input.id} {...input} value={values[input.name]} onChange={onChange} />
						))}
						{error && <p className="error">Invalid username or password!</p>}
						<button>Login</button>

						<p>
							Don't have acount?
							<span>
								<Link className="dontHave" to="signup">
									Sign up.
								</Link>
							</span>
						</p>
					</form>
					{loading && (
						<Backdrop sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
							<CircularProgress color="inherit" />
						</Backdrop>
					)}
				</div>
			)}
		</>
	);
}

export default Login;
