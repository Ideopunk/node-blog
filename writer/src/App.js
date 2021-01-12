import "./Style/App.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import MCE from "./Components/MCE";
import Message from "./Components/Message";
import Dashboard from "./Components/Dashboard";
import Comments from "./Components/Comments";
axios.defaults.baseURL = "http://localhost:8080";

const App = () => {
	const [name, setName] = useState("");
	const [id, setID] = useState("");
	const [posts, setPosts] = useState([]);
	const [verification, setVerification] = useState(false);
	const [token, setToken] = useState(localStorage.getItem("myToken"));
	const [updateID, setUpdateID] = useState("");
	const [message, setMessage] = useState("");

	axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

	// protected
	useEffect(() => {
		if (token) {
			console.log(token);
			axios
				.get("/user")
				.then((response) => {
					console.log("profile");
					console.log(response);
					setName(response.data.name);
					setID(response.data.id);
					setPosts(response.data.posts);
					setVerification(response.data.status === "verified" ? true : false);
				})
				.catch((err) => console.log(err));
		} else {
			setName("");
			setID("");
			setPosts([]);
			setVerification(false);
		}
	}, [token]);

	// expire messages
	useEffect(() => {
		if (message) {
			setTimeout(() => {
				setMessage("");
			}, 1500);
		}
	}, [message]);

	const verifyEmail = () => {
		axios
			.post(`/auth`)
			.then((response) => {
				console.log(response);
				if (response.status === 404) {
					console.log("code not found, resend code. ");
				} else {
					setVerification(response.data.status === "verified" ? true : false);
				}
			})
			.catch((err) => console.log(err));
	};

	const signOut = () => {
		setUpdateID("")
		localStorage.setItem("myToken", "");
		setToken("");
	};

	return (
		<div className="App flex">
			<Dashboard
				token={token}
				setToken={setToken}
				posts={posts}
				setUpdateID={setUpdateID}
				verification={verification}
				verifyEmail={verifyEmail}
				signOut={signOut}
				name={name}
			/>
			<div className="main">
				<MCE
					updateID={updateID}
					setUpdateID={setUpdateID}
					name={name}
					id={id}
					token={token}
					verification={verification}
					setMessage={setMessage}
				/>
			</div>
			{updateID && <Comments postID={updateID} token={token} />}
			{message && <Message text={message} />}
		</div>
	);
};

export default App;
