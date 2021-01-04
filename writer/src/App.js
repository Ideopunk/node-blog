import "./Style/App.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import MCE from "./Components/MCE";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Dashboard from "./Components/Dashboard";
import Comments from "./Components/Comments";
axios.defaults.baseURL = "http://localhost:8080";

const App = () => {
	const [text, setText] = useState("");
	const [name, setName] = useState("");
	const [id, setID] = useState("");
	const [posts, setPosts] = useState([]);
	const [token, setToken] = useState(localStorage.getItem("myToken"));
	const [updateID, setUpdateID] = useState("");
	axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

	// trivial
	useEffect(() => {
		axios.get("/").then((response) => setText(response.data));
	}, []);

	// protected
	useEffect(() => {
		console.log(token);
		axios
			.get("/user")
			.then((response) => {
				console.log("profile");
				console.log(response);
				setName(response.data.name);
				setID(response.data.id);
				setPosts(response.data.posts);
			})
			.catch((err) => console.log(err));
	}, [token]);

	return (
		<div className="App flex">
			<Dashboard token={token} posts={posts} setUpdateID={setUpdateID} />
			<div className="main">
				<p>{name ? `Hi ${name}!` : "Hi there!"}</p>
				<p>{text}</p>

				{!name && (
					<>
						<Signup />

						<Login token={token} setToken={setToken} />
					</>
				)}
				<MCE updateID={updateID} setUpdateID={setUpdateID} name={name} id={id} token={token} />
				{updateID && <Comments postID={updateID} />}
			</div>
		</div>
	);
};

export default App;
