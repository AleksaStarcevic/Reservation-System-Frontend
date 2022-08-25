import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

function PopUp(props) {
	const { title, children, openPopup, setOpenPopup, loading, setLoading } = props;
	return (
		<Dialog
			open={openPopup}
			// fullScreen={true}
			maxWidth={"lg"}
			fullWidth={true}
		>
			<DialogTitle style={{ height: "60px" }}>
				<div style={{ display: "flex" }}>
					<h3 style={{ flexGrow: 1, textAlign: "center" }}>{title}</h3>
					<button className="btnClosePopUp" onClick={() => setOpenPopup(false)}>
						X
					</button>
				</div>
			</DialogTitle>
			<DialogContent style={{ background: "#fafafa" }} dividers>
				{children}
			</DialogContent>
		</Dialog>
	);
}

export default PopUp;
