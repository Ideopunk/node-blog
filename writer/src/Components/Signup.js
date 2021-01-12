import React, { useState } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080";

const Signup = ({ setMenu }) => {
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

	const handleClick = (e) => {
		if (e.target.getAttribute("name") === "cover") {
			setMenu("");
		}
	};
	return (
		<div className="cover" name="cover" onClick={handleClick}>
			<form onSubmit={handleSignUp} className="auth-form">
				<label>
					<p className="center">Name</p>
					<input name="name" required onChange={handleName} className="auth-input" />
				</label>
				<label>
					<p className="center">Email</p>
					<input
						name="email"
						required
						type="email"
						onChange={handleEmail}
						autoComplete="username"
						className="auth-input"
					/>
				</label>

				<label>
					<p className="center">Password</p>
					<input
						type="password"
						name="password"
						autoComplete="new-password"
						required
						minLength="8"
						onChange={handlePassword}
						className="auth-input"
					/>
				</label>

				<label>
					<p className="center">Confirm Password</p>
					<input
						type="password"
						name="confirm"
						required
						minLength="8"
						onChange={handleConfirm}
						autoComplete="new-password"
						className="auth-input"
					/>
				</label>

				<input type="submit" value="SIGN UP" className="mrg-top" />
			</form>
		</div>
	);
};

export default Signup;
