import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

function PopUp(props) {
	const { title, children, openPopup, setOpenPopup } = props;
	return (
		<Dialog open={openPopup} fullScreen={true}>
			<DialogTitle>
				<div style={{ display: "flex" }}>
					<h3 style={{ flexGrow: 1, textAlign: "center" }}>{title}</h3>
					<button onClick={() => setOpenPopup(false)}>X</button>
				</div>
			</DialogTitle>
			<DialogContent style={{ display: "flex", flexDirection: "column", alignItems: "center" }} dividers>
				{children}
			</DialogContent>
		</Dialog>
	);
}

export default PopUp;
