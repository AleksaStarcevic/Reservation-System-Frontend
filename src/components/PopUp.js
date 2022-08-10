import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

function PopUp(props) {
	const { title, children, openPopup, setOpenPopup } = props;
	return (
		<Dialog open={openPopup} maxWidth="md">
			<DialogTitle>
				<div style={{ display: "flex" }}>
					<h3 style={{ flexGrow: 1 }}>{title}</h3>
					<button onClick={() => setOpenPopup(false)}>X</button>
				</div>
			</DialogTitle>
			<DialogContent dividers>{children}</DialogContent>
		</Dialog>
	);
}

export default PopUp;
