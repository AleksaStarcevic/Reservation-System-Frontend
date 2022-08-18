import React, { useState, useEffect, useContext } from "react";
import FormInput from "./components/FormInput";
import axios from "./api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Select } from "@mui/material";

function SignUp() {
	const [values, setValues] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		firstname: "",
		lastname: "",
		department: "",
		title: "",
		education: "",
	});
	const [displaySpan, setDisplaySpan] = useState(false);
	const inputs = [
		{
			id: 1,
			name: "email",
			type: "email",
			placeholder: "Email",
			errorMessage: "Email must be valid",
			label: "Email",
			pattern: "^[w-.]+@([w-]+.)+[w-]{2,4}$",
			required: true,
		},

		{
			id: 2,
			name: "password",
			type: "password",
			placeholder: "Password",
			errorMessage: "Password length must be at least 4 and include at least 1 number",
			label: "Password",
			pattern: "^(?=.*?[0-9]).{4,}$",
			required: true,
		},
		{
			id: 3,
			name: "confirmPassword",
			type: "password",
			placeholder: "Confirm Password",
			errorMessage: "Passwords don't match!",
			label: "Confirm Password",
			pattern: values.password,
			required: true,
		},
		{
			id: 4,
			name: "firstname",
			type: "text",
			placeholder: "Firstname",
			errorMessage: "First name length must be greater than 2 and contains only letters",
			label: "Firstname",
			pattern: "^[a-zA-Z].{2,}$",
			required: true,
		},
		{
			id: 5,
			name: "lastname",
			type: "text",
			placeholder: "Lastname",
			errorMessage: "Last name length must be greater than 2 and contains only letters",
			label: "Lastname",
			pattern: "^[a-zA-Z].{2,}$",
			required: true,
		},
	];

	const onChange = e => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	async function handleSubmit(e) {
		e.preventDefault();

		// setValues({
		// 	email: "",
		// 	password: "",
		// 	confirmPassword: "",
		// 	firstname: "",
		// 	lastname: "",
		// });

		const objectToSend = {
			email: values.email,
			password: values.password,
			firstName: values.firstname,
			lastName: values.lastname,
			image: "",
		};

		try {
			let response = await axios.post(`/register`, objectToSend);

			if (response.status === 200) {
				//redirect na kucanje koda
				console.log("yay");
			}
		} catch (err) {
			setDisplaySpan(true);
		}
	}

	return (
		<>
			<div className="app">
				<form id="myForm" onSubmit={e => handleSubmit(e)}>
					<div>
						<h1>Register</h1>
						{inputs.map(input => (
							<FormInput key={input.id} {...input} value={values[input.name]} onChange={onChange} />
						))}
						{displaySpan && <span style={{ color: "red" }}>User is already registered, go to sign in</span>}
						<button>Submit</button>
						<p>
							Already have account?
							<span>
								<Link to="/">Sign in</Link>
							</span>
						</p>
					</div>
					<div className="signupSelects">
						<Select
							className="signupSelect"
							value={values.department}
							onChange={e => setValues({ ...values, department: e.value })}
							// options={appointmentTypes}
							placeholder="Select department"
						/>
						<Select
							className="signupSelect"
							value={values.title}
							onChange={e => setValues({ ...values, title: e.value })}
							// options={appointmentTypes}
							placeholder="Select title"
						/>
						<Select
							className="signupSelect"
							value={values.education}
							onChange={e => setValues({ ...values, education: e.value })}
							// options={appointmentTypes}
							placeholder="Select education"
						/>
					</div>
				</form>
			</div>
		</>
	);
}

export default SignUp;
