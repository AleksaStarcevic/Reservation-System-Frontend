import Login from "./Login";
import MainPage from "./MainPage";
import { Routes, Route } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import SignUp from "./SignUp";
import Sidebar from "./components/Sidebar";
import ReservationsPage from "./ReservationsPage";
import AccountPage from "./AccountPage";
import RequestsByUserPage from "./components/RequestsByUserPage";
function App() {
	return (
		<>
			<Sidebar></Sidebar>
			<Routes>
				<Route path="/signup" element={<SignUp />} />
				<Route path="/" element={<Login />} />
				<Route path="/main" element={<MainPage />} />
				<Route path="/user/reservations" element={<ReservationsPage />} />

				<Route path="/account" element={<AccountPage />} />
				<Route path="/user/reservations/pending/:id" element={<RequestsByUserPage />} />
				<Route path="*" element={<ErrorPage />} />
			</Routes>
		</>
	);
}

export default App;
