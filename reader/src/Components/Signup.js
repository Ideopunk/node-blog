import React, { useState } from "react";
import axios from "./config/axios";

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
		<form onSubmit={handleSignUp} className="wrap">
			<label>
				<p className="center">Name</p>
				<input name="name" required onChange={handleName} />
			</label>
			<label>
				<p className="mrg-top center">Email</p>
				<input
					name="email"
					required
					type="email"
					onChange={handleEmail}
					autoComplete="username"
				/>
			</label>

			<label>
				<p className="mrg-top center">Password</p>
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
				<p className="mrg-top center">Confirm password</p>
				<input
					type="password"
					name="confirm"
					required
					minLength="8"
					onChange={handleConfirm}
					autoComplete="new-password"
					className="mrg-bot"
				/>
			</label>

			<input type="submit" value="Sign Up" className="mrg-top" />
		</form>
	);
};

export default Signup;
