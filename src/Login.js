import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "./api/axios";
import AuthContext from "./context/AuthProvider";

function Login() {
	const { setAuth } = useContext(AuthContext); // postavljanje globalnog korisnika

	const userRef = useRef();
	const errRef = useRef();

	const [user, setUser] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [success, setSuccess] = useState(false);
	let navigate = useNavigate();

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		setErrorMessage("");
	}, [user, password]);

	async function handleSubmit(e) {
		e.preventDefault();
		setUser("");
		setPassword("");

		const response = await axios.post(
			"/login",
			new URLSearchParams({
				username: user,
				password: password,
			}), // username kao za dto
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);

		if (response.headers.validationtoken) {
			setSuccess(true);
		}

		const accessToken = response?.headers?.validationtoken;
		setAuth({ email: user, token: accessToken });

		// if (response.status === 400) {
		// 	setErrorMessage("Missing username or password");
		// } else if (response.status === 401) {
		// 	setErrorMessage("Unathorized");
		// } else {
		// 	setErrorMessage("Login failed!");
		// }
	}

	return (
		<>
			{success ? (
				navigate("/main")
			) : (
				<section>
					<p ref={errRef}>{errorMessage}</p>
					<h1>Sign in</h1>
					<form onSubmit={handleSubmit}>
						<label>Username</label>
						<input
							type="text"
							name="username"
							value={user}
							ref={userRef}
							onChange={e => setUser(e.target.value)}
							required
						></input>
						<label>Password</label>
						<input
							type="password"
							name="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
						></input>
						<button>Sign In</button>
					</form>
					<p>
						Need acount?
						<span>
							<Link to="signup">Sign up</Link>
						</span>
					</p>
				</section>
			)}
		</>
	);
}

export default Login;
