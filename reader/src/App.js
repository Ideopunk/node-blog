import "./Style/App.scss";
import React, { useEffect, useState } from "react";
import PostLink from "./Components/PostLink";
import PostFull from "./Components/PostFull";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080";

const App = () => {
	const [text, setText] = useState("");
	const [posts, setPosts] = useState("");
	const [display, setDisplay] = useState("");

	useEffect(() => {
		axios.get("/").then((response) => setText(response.data));
		// axios.get
	}, []);


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

	return (
		<div className="App">
			<p>{text}</p>
			<div className="post-container">{posts}</div>
			{display && <PostFull postID={display} setDisplay={setDisplay}/>}
		</div>
	);
};

export default App;
