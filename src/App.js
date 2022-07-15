import Login from "./Login";
import MainPage from "./MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import SignUp from "./SignUp";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/signup" element={<SignUp />} />
				<Route path="/" element={<Login />} />
				<Route path="/main" element={<MainPage />} />
				<Route path="*" element={<ErrorPage />} />
			</Routes>
		</Router>
	);
}

export default App;
