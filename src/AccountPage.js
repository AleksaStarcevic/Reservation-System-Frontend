import React, { useContext, useEffect, useState } from "react";
import AuthContext from "./context/AuthProvider";
import axios from "./api/axios";

function AccountPage() {
	const { auth } = useContext(AuthContext);

	return <div>AccountPage</div>;
}

export default AccountPage;
