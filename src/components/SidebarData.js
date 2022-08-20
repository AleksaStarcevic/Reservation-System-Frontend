import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

export const SidebarData = [
	{
		title: "Home",
		icon: <HomeIcon />,
		link: "/main",
	},

	{
		title: "Requests",
		icon: <CalendarMonthIcon />,
		link: "user/reservations",
	},
	{
		title: "Account",
		icon: <AccountCircleIcon />,
		link: "/account",
	},
	{
		title: "Logout",
		icon: <LogoutIcon />,
		link: "/",
	},
];
