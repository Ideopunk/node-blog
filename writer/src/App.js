import "./App.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import MCE from "./Components/MCE";
import Login from "./Components/Login";
axios.defaults.baseURL = "http://localhost:8080";

const App = () => {
	const [text, setText] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [confirm, setConfirm] = useState("");


	const [token, setToken] = useState(localStorage.getItem("myToken"));

	axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

	useEffect(() => {
		axios.get("/").then((response) => setText(response.data));
		// axios.get
	}, []);

	useEffect(() => {
		console.log(token);
		axios
			.get("/profile")
			.then((response) => {
				console.log("profile");
				console.log(response);
				setText(response.data);
			})
			.catch((err) => console.log(err));
	}, [token]);

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
		<div className="App">
			<p>Yo</p>
			<p>{text}</p>
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
			<br />

			<Login token={token} setToken={setToken} />
			<MCE />
		</div>
	);
};

export default App;
