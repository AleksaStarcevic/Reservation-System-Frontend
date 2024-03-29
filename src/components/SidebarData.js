import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import BadgeIcon from "@mui/icons-material/Badge";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";

export const SidebarDataAdmin = [
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
		title: "Employees",
		icon: <BadgeIcon />,
		link: "/employees",
	},
	{
		title: "My appointments",
		icon: <PermContactCalendarIcon />,
		link: "/appointments",
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
