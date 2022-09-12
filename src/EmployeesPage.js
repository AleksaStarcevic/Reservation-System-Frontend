import React, { useContext, useEffect, useState } from "react";
import AuthContext from "./context/AuthProvider";
import axios from "./api/axios";
import { useNavigate, Link } from "react-router-dom";
import avatarImage from "./avatar.png";
import PopUp from "./components/PopUp";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EmployeesPage() {
	const [authUser, setAuthUser] = useState(getInitialState);
	const [users, setUsers] = useState([]);
	const [openPopup, setOpenPopup] = useState(false);
	const [newEmployee, setNewEmployee] = useState({
		email: "",
		firstName: "",
		lastName: "",
		department: "",
		title: "",
		type: "",
	});

	const [departments, setDepartments] = useState([]);
	const [titles, setTitles] = useState([]);
	const [types, setTypes] = useState([]);

	function getInitialState() {
		const user = localStorage.getItem("user");
		return user ? JSON.parse(user) : {};
	}

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

	useEffect(() => {
		const fetchEmployees = async () => {
			try {
				let response = await axios.get(`user/employees`, {
					headers: { Authorization: `Bearer ${authUser.token}` },
				});
				setUsers(response.data);
			} catch (err) {
				console.log(err);
			}
		};

		const fetchDepartments = async () => {
			try {
				let response = await axios.get(`common/employee/departments`, {
					headers: { Authorization: `Bearer ${authUser.token}` },
				});
				let ar = [];

				if (Array.isArray(response.data)) {
					ar = response.data.map(el => {
						return { label: el.name, value: el.id };
					});
				}

				setDepartments(ar);
			} catch (err) {
				console.log(err);
			}
		};

		const fetchTypes = async () => {
			try {
				let response = await axios.get(`common/employee/types`, {
					headers: { Authorization: `Bearer ${authUser.token}` },
				});

				let ar = [];

				if (Array.isArray(response.data)) {
					ar = response.data.map(el => {
						return { label: el.name, value: el.id };
					});
				}

				setTypes(ar);
			} catch (err) {
				console.log(err);
			}
		};

		const fetchTitles = async () => {
			try {
				let response = await axios.get(`common/education/titles`, {
					headers: { Authorization: `Bearer ${authUser.token}` },
				});

				let ar = [];

				if (Array.isArray(response.data)) {
					ar = response.data.map(el => {
						return { label: el.name, value: el.id };
					});
				}
				setTitles(ar);
			} catch (err) {
				console.log(err);
			}
		};

		if (authUser.admin) {
			fetchEmployees();
			fetchDepartments();
			fetchTypes();
			fetchTitles();
		}
	}, [openPopup]);

	async function handleAddEmployee() {
		try {
			let response = await axios.post(`user/add-employee`, newEmployee, {
				headers: { Authorization: `Bearer ${authUser.token}` },
			});
			notifySuccess("Employee successfully added");
		} catch (err) {
			notifyError("Employee already exist");
		}
	}

	return (
		<div className="glavniDiv">
			<div className="aa">
				<div className="dugmad">
					<span>Add employee</span>
					<AddCircleIcon fontSize="large" onClick={() => setOpenPopup(true)}></AddCircleIcon>
				</div>
			</div>
			<div className="container">
				{users.map(el => {
					return (
						<div className="card_item" key={el.email}>
							<div className="card_inner">
								<img src={avatarImage} alt="" />
								<div className="userName">{`${el.firstName} ${el.lastName}`}</div>
								<div className="userUrl">{el.type}</div>
								<div className="userUrl">{el.title}</div>
								<div className="detail-box">
									<div className="gitDetail">
										<span style={{ background: "#02a186" }}></span>
										{el.department}
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<PopUp title="Add employee" openPopup={openPopup} setOpenPopup={setOpenPopup}>
				<div className="empDiv">
					<input
						type="email"
						placeholder="Add Email"
						style={{ width: "20%", marginRight: "10px" }}
						value={newEmployee.email}
						onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })}
					/>
					<input
						type="text"
						placeholder="Add Firstname"
						style={{ width: "20%", marginRight: "10px" }}
						value={newEmployee.firstName}
						onChange={e => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
					/>
					<input
						type="text"
						placeholder="Add Lastname"
						style={{ width: "20%", marginRight: "10px" }}
						value={newEmployee.lastName}
						onChange={e => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
					/>
					<Select
						className="empSelect"
						value={newEmployee.department.label}
						onChange={e => setNewEmployee({ ...newEmployee, department: e.value })}
						options={departments}
						placeholder="Add department"
					/>
					<Select
						className="empSelect"
						value={newEmployee.type.label}
						onChange={e => setNewEmployee({ ...newEmployee, type: e.value })}
						options={types}
						placeholder="Add type"
					/>
					<Select
						className="empSelect"
						value={newEmployee.title.label}
						onChange={e => setNewEmployee({ ...newEmployee, title: e.value })}
						options={titles}
						placeholder="Add title"
					/>
					<button className="btnAddEventEmp" style={{ marginTop: "10px" }} onClick={handleAddEmployee}>
						Add employee
					</button>
				</div>
			</PopUp>
		</div>
	);
}

export default EmployeesPage;
