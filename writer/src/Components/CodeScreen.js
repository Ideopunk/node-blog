import React, { useState } from "react";
import axios from "./config/axios";

const CodeScreen = ({ token, setCodeScreen, setVerification }) => {
	const [secret, setSecret] = useState("");

	axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

	const handleChange = (e) => {
		setSecret(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		axios
			.post(`/auth/secret`, {
				secret: secret,
			})
			.then((response) => {
				if (response.data === "success") {
					setVerification(true)
					setCodeScreen(false)
				}
			})
			.catch((err) => console.error(err));
	};

	const handleClick = (e) => {
		if (e.target.getAttribute("name") === "cover") {
			setCodeScreen(false);
		}
	};

	return (
		<div className="cover" name="cover" onClick={handleClick}>
			<form className="message column" onSubmit={handleSubmit}>
				<label htmlFor="code">Enter code</label>
				<input
					name="code"
					id="code"
					className="auth-input mrg-bot"
					onChange={handleChange}
				/>
				<input type="submit" value="Submit Code" className="submit-button rad" />
			</form>
		</div>
	);
};

export default CodeScreen;
