import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
const SidebarLayout = () => (
	<>
		<Sidebar />
		<Outlet />
	</>
);

export default SidebarLayout;
