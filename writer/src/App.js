import "./App.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import MCE from "./Components/MCE";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
axios.defaults.baseURL = "http://localhost:8080";

const App = () => {
	const [text, setText] = useState("");
	const [name, setName] = useState("");
	const [id, setID] = useState("");
	const [token, setToken] = useState(localStorage.getItem("myToken"));
	axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

	// trivial
	useEffect(() => {
		axios.get("/").then((response) => setText(response.data));
	}, []);

	// protected
	useEffect(() => {
		console.log(token);
		axios
			.get("/profile")
			.then((response) => {
				console.log("profile");
				console.log(response);
				setName(response.data.name);
				setID(response.data.id);
			})
			.catch((err) => console.log(err));
	}, [token]);

	return (
		<div className="App">
			<p>{name ? `Hi ${name}!` : "Hi there!"}</p>
			<p>{text}</p>

			{!name && (
				<>
					<Signup />

					<Login token={token} setToken={setToken} />
				</>
			)}
			<MCE name={name} id={id} token={token} />
		</div>
	);
};

export default App;
