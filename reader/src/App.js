import "./Style/App.scss";
import React, { useEffect, useState } from "react";
import PostLink from "./Components/PostLink";
import PostFull from "./Components/PostFull";
import Selector from "./Components/Selector";
import Verifier from "./Components/Verifier";
import axios from "./Components/config/axios";

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
			axios
				.get("/user")
				.then((response) => {
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
			const posts = response.data.map((post) => (
				<PostLink
					title={post.title}
					preview={post.preview}
					created={post.create_date_formatted_short}
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
			<div className="post-container">{posts}</div>

			<aside className="sidebar">
				{token ? (
					<>
						<p className="center mrg-bot wide">Hi {name}!</p>
						<button onClick={signOut} className="full">
							Sign Out
						</button>
					</>
				) : (
					<Selector token={token} setToken={setToken} />
				)}

				{token && !verification && <Verifier token={token} setVerification={setVerification}/>}
				<button className="mrg-top mrg-bot">
					<a href="localhost:3000" target="_blank" rel="noreferrer" className="nodec">
						Writer
					</a>
				</button>
			</aside>

			{display && (
				<PostFull
					postID={display}
					setDisplay={setDisplay}
					verification={verification}
					verifyEmail={verifyEmail}
					token={token}
				/>
			)}
		</div>
	);
};

export default App;
