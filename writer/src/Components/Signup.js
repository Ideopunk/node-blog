import React, { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080";

const Signup = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [confirm, setConfirm] = useState("");

	const handleName = (e) => {
		setName(e.target.value);
	};

	const handleEmail = (e) => {
		setEmail(e.target.value);
	};

	const handlePassword = (e) => {
		setPassword(e.target.value);
	};

	const handleConfirm = (e) => {
		setConfirm(e.target.value);
	};

	const handleSignUp = (e) => {
		e.preventDefault();
		axios
			.post("/sign-up", {
				name: name,
				username: email,
				password: password,
				confirm: confirm,
			})
			.then((response) => console.log(response))
			.catch((err) => console.log(err));
	};

	return (
		<form onSubmit={handleSignUp}>
			<label>
				Name
				<input name="name" required onChange={handleName} />
			</label>
			<label>
				Email
				<input
					name="email"
					required
					type="email"
					onChange={handleEmail}
					autoComplete="username"
				/>
			</label>

			<label>
				Password
				<input
					type="password"
					name="password"
					autoComplete="new-password"
					required
					minLength="8"
					onChange={handlePassword}
				/>
			</label>

			<label>
				Confirm Password
				<input
					type="password"
					name="confirm"
					required
					minLength="8"
					onChange={handleConfirm}
					autoComplete="new-password"
				/>
			</label>

			<input type="submit" value="sign-up" />
		</form>
	);
};

export default Signup;
