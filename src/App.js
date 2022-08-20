import Login from "./Login";
import MainPage from "./MainPage";
import { Routes, Route } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import SignUp from "./SignUp";
import Sidebar from "./components/Sidebar";
import ReservationsPage from "./ReservationsPage";
import AccountPage from "./AccountPage";
import RequestsByUserPage from "./components/RequestsByUserPage";
import SidebarLayout from "./components/SidebarLayout";

function App() {
	return (
		<div className="appDiv">
			<Routes>
				<Route path="/signup" element={<SignUp />} />
				<Route path="/" element={<Login />} />

				<Route element={<SidebarLayout />}>
					<Route path="/main" element={<MainPage />} />
					<Route path="/user/reservations" element={<ReservationsPage />} />
					<Route path="/account" element={<AccountPage />} />
					<Route path="/user/reservations/pending/:id" element={<RequestsByUserPage />} />
					<Route path="*" element={<ErrorPage />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App;
