import React, { useState, useEffect, useContext } from "react";
import FormInput from "./components/FormInput";
import axios from "./api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Select } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FonImage from "./fon.png";
function SignUp() {
	const navigate = useNavigate();
	const [values, setValues] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		firstname: "",
		lastname: "",
		image: "",
	});
	const [loading, setLoading] = useState(false);

	// const [upload, setUpload] = useState("");
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
		// {
		// 	id: 6,
		// 	name: "simage",
		// 	type: "file",
		// 	label: "Image",
		// },
	];

	const notifySuccess = text => {
		toast.success(text, {
			position: "bottom-center",
			autoClose: 3000,
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

	const onChange = e => {
		// if (e.target.name === "image") {
		// 	setValues({ ...values, [e.target.name]: e.target.files[0] });
		// 	console.log(e.target.files[0]);
		// } else {
		setValues({ ...values, [e.target.name]: e.target.value });
		// }
	};

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(prev => !prev);

		// setValues({
		// 	email: "",
		// 	password: "",
		// 	confirmPassword: "",
		// 	firstname: "",
		// 	lastname: "",
		// });
		// const fd = new FormData();
		// fd.append("image", values.image, values.image.name);

		const objectToSend = {
			email: values.email,
			password: values.password,
			firstName: values.firstname,
			lastName: values.lastname,
			image: "",
		};

		try {
			let response = await axios.post(`/register`, objectToSend);

			setLoading(false);
			if (response.status === 200) {
				notifySuccess("Registration successfull, check your email");
				navigate("/");
			}
		} catch (err) {
			setDisplaySpan(true);
		}
	}

	console.log(values);

	return (
		<>
			<div className="app">
				<header>
					<img src={FonImage}></img>
				</header>
				<form id="myForm" onSubmit={e => handleSubmit(e)}>
					<div>
						<h1>Register</h1>
						{inputs.map(input => (
							<FormInput key={input.id} {...input} value={values[input.name]} onChange={onChange} />
						))}
						{/* <input type="file" onChange={e => setValues({ ...values, image: e.target.files[0] })}></input> */}

						{displaySpan && <span style={{ color: "red" }}>User is already registered, go to sign in</span>}

						<button>Submit</button>
						<p>
							Already have account?
							<span>
								<Link className="dontHave" to="/">
									Sign in.
								</Link>
							</span>
						</p>
					</div>
				</form>
			</div>
			{loading && (
				<Backdrop sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
					<CircularProgress color="inherit" />
				</Backdrop>
			)}
		</>
	);
}

export default SignUp;
