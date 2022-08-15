import React from "react";
import "../App.css";
import { SidebarData } from "./SidebarData";
import { useNavigate } from "react-router-dom";

function Sidebar() {
	let navigate = useNavigate();
	return (
		<div className="Sidebar">
			<ul className="SidebarList">
				{SidebarData.map((el, key) => {
					return (
						<li className="row" key={key} onClick={() => navigate(el.link)}>
							{" "}
							<div id="icon">{el.icon}</div>
							<div id="title">{el.title}</div>
						</li>
					);
				})}{" "}
			</ul>
		</div>
	);
}

export default Sidebar;
