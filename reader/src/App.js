import "./Style/App.scss";
import React, { useEffect, useState } from "react";
import PostLink from "./Components/PostLink";
import PostFull from "./Components/PostFull";
import Selector from "./Components/Selector";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080";

const App = () => {
	const [posts, setPosts] = useState("");
	const [display, setDisplay] = useState("");
	const [token, setToken] = useState(localStorage.getItem("myToken"));
	const [verification, setVerification] = useState(false);
	const [name, setName] = useState("");
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
					setVerification(response.data.status === "verified" ? true : false);
				})
				.catch((err) => console.log(err));
		} else {
			setName("");
			setVerification(false);
		}
	}, [token]);

	useEffect(() => {
		axios.get("/posts").then((response) => {
			console.log(response.data);
			const posts = response.data.map((post) => (
				<PostLink
					title={post.title}
					preview={post.preview}
					created={post.create_date_formatted}
					name={post.user.name}
					key={post.create_date_formatted + post.user.name}
					id={post._id}
					setDisplay={setDisplay}
				/>
			));
			setPosts(posts);
		});
	}, []);

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
		localStorage.setItem("myToken", "");
		setToken("");
	};

	return (
		<div className="App">
			<p>{name}</p>
			<div className="post-container">{posts}</div>
			{display && (
				<PostFull
					postID={display}
					setDisplay={setDisplay}
					verification={verification}
					verifyEmail={verifyEmail}
					token={token}
				/>
			)}
			{name ? (
				<div onClick={signOut}>Sign Out</div>
			) : (
				<Selector token={token} setToken={setToken} />
			)}
		</div>
	);
};

export default App;
