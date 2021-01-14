import "./Style/App.scss";
import React, { useEffect, useState } from "react";
import axios from "./Components/config/axios";
import MCE from "./Components/MCE";
import Message from "./Components/Message";
import Dashboard from "./Components/Dashboard";
import Comments from "./Components/Comments";

const App = () => {
	const [name, setName] = useState("");
	const [id, setID] = useState("");
	const [posts, setPosts] = useState([]);
	const [verification, setVerification] = useState(false);
	const [token, setToken] = useState(localStorage.getItem("myToken"));
	const [updateID, setUpdateID] = useState("");
	const [message, setMessage] = useState("");
	const [display, setDisplay] = useState(true);

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

	const refreshPosts = () => {
		axios.get("/user").then((response) => {
			setPosts(response.data.posts);
		});
	};

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
				if (response.data === "failure") {
					setMessage("We weren't able to send an email");
				} else {
					setMessage("An email has been sent");
				}
			})
			.catch((err) => console.log(err));
	};

	const signOut = () => {
		setUpdateID("");
		localStorage.setItem("myToken", "");
		setToken("");
	};

	const handleClick = (e) => {
		const targ = e.target;

		const arr = ["dashboard", "cover"];
		if (
			!arr.includes(targ.getAttribute("name")) &&
			!arr.includes(targ.parentNode.getAttribute("name")) &&
			!arr.includes(targ.parentNode.parentNode.getAttribute("name")) &&
			!arr.includes(targ.parentNode.parentNode.parentNode.getAttribute("name")) &&
			!arr.includes(targ.parentNode.parentNode.parentNode.parentNode.getAttribute("name"))
		) {
			setDisplay(false);
		}
	};

	return (
		<div className="App flex" onClick={handleClick}>
			<Dashboard
				token={token}
				setToken={setToken}
				posts={posts}
				setUpdateID={setUpdateID}
				verification={verification}
				setVerification={setVerification}
				verifyEmail={verifyEmail}
				signOut={signOut}
				name={name}
				refreshPosts={refreshPosts}
				setMessage={setMessage}
				display={display}
				setDisplay={setDisplay}
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
					refreshPosts={refreshPosts}
					setDisplay={setDisplay}
				/>
			</div>
			{updateID && <Comments postID={updateID} token={token} />}
			{message && <Message text={message} />}
		</div>
	);
};

export default App;
