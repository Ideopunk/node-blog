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
		axios
			.post(`/auth`)
			.then((response) => console.log(response))
			.catch((err) => console.log(err));
	};

	return (
		<form className="center">
			<input value={code} onChange={handleChange} required className="mrg-bot" />
			<input type="submit" onClick={handleSubmit} className="mrg-bot" value="Verify code" />
			<button onClick={handleEmail} className="mrg-bot">
				Resend Email
			</button>
		</form>
	);
};

export default Verifier;
