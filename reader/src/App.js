import "./App.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080";

const App = () => {
	const [text, setText] = useState("");
	const [posts, setPosts] = useState("");
	const [post, setPost] = useState("");

	useEffect(() => {
		axios.get("/").then((response) => setText(response.data));
		// axios.get
	}, []);

	useEffect(() => {
		axios.get("/posts").then((response) => setPosts(response.data));
	}, []);

  useEffect(() => {
		axios.get("/posts/yo").then((response) => setPost(response.data));
  }, []);
  
	return (
		<div className="App">
			<p>{text}</p>
			<div>{posts}</div>
			<div>{post}</div>
		</div>
	);
};

export default App;
