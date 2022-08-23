import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer, toast } from "react-toastify";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import { BrowserRouter } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<AuthProvider>
		<BrowserRouter>
			<App />
			<ToastContainer />
		</BrowserRouter>
	</AuthProvider>
);
