import axios from "./config/axios";
import React, { useState } from "react";

const Verifier = ({ token, setVerification }) => {
	axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

	const [code, setCode] = useState("");

	const handleChange = (e) => {
		setCode(e.target.value);
	};

	// try to validate email
	const handleSubmit = (e) => {
		e.preventDefault();
		axios
			.post(`/auth/secret`, {
				secret: code,
			})
			// this should retrigger things
			.then((response) => setVerification(response.data.status === "verified" ? true : false))
			.catch((err) => console.error(err));
	};

	// resend verification email
	const handleEmail = (e) => {
		e.preventDefault();
		axios.post(`/auth`);
	};

	return (
		<>
			<input value={code} onChange={handleChange} />
			<button onClick={handleSubmit} className="mrg-bot">
				Verify
			</button>
			<button onClick={handleEmail} className="mrg-bot">
				Resend Email
			</button>
		</>
	);
};

export default Verifier;
