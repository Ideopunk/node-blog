import React, { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080";

const Login = ({ token, setToken }) => {
	const [loginEmail, setLoginEmail] = useState("");
	axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

	const [loginPassword, setLoginPassword] = useState("");

	const handleLoginEmail = (e) => {
		setLoginEmail(e.target.value);
	};

	const handleLoginPassword = (e) => {
		setLoginPassword(e.target.value);
	};

	const handleLogin = (e) => {
		e.preventDefault();
		axios
			.post("/login", {
				username: loginEmail,
				password: loginPassword,
			})
			.then((response) => {
				console.log(response);
				localStorage.setItem("myToken", response.data.token);
				setToken(response.data.token);
			})
			.catch((err) => console.log(err));
	};

	return (
		<form onSubmit={handleLogin}>
			<label>
				Email
				<input
					name="email"
					required
					type="email"
					onChange={handleLoginEmail}
					autoComplete="username"
				/>
			</label>

			<label>
				Password
				<input
					type="password"
					name="password"
					required
					minLength="8"
					onChange={handleLoginPassword}
					autoComplete="current-password"
				/>
			</label>
			<input type="submit" value="Log in" />
		</form>
	);
};

export default Login;
