import React, { useState } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080";

const CodeScreen = (token) => {
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
			.then((response) => console.log(response))
			.catch((err) => console.log(err));
	};

	return (
		<div className="cover">
			<form className="codescreen" onSubmit={handleSubmit}>
				<label>
					Submit code
					<input name="code" onChange={handleChange} />
					<input type="submit" value="Submit Code" />
				</label>
			</form>
		</div>
	);
};

export default CodeScreen;
