import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

function PopUp(props) {
	const { title, children, openPopup, setOpenPopup, loading, setLoading } = props;
	return (
		<Dialog
			open={openPopup}
			// fullScreen={true}
			maxWidth={"md"}
			fullWidth={true}
		>
			<DialogTitle>
				<div style={{ display: "flex" }}>
					<h3 style={{ flexGrow: 1, textAlign: "center" }}>{title}</h3>
					<button onClick={() => setOpenPopup(false)}>X</button>
				</div>
			</DialogTitle>
			<DialogContent className="contentpopup" dividers>
				{children}
			</DialogContent>
		</Dialog>
	);
}

export default PopUp;
