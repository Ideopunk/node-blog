import React, { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080";

const PostFull = ({ postID }) => {
	const [title, setTitle] = useState("");
	const [text, setText] = useState("");
	const [created, setCreated] = useState("");
	const [updated, setUpdated] = useState("");
	const [name, setName] = useState("");

	useEffect(() => {
		console.log(postID);
		axios
			.get(`/posts/${postID}`)
			.then((response) => {
				console.log(response.data);
				setTitle(response.data.title);
				setText(response.data.text);
				setCreated(response.data.created);
				setUpdated(response.data.updated);
				setName(response.data.name);
			})
			.catch((err) => console.log(err));
	}, [postID]);

	function createMarkup() {
		return { __html: text };
	}

	return (
		<div className="post-full">
			<h2>{title}</h2>
			<p>{name}</p>
			<time>{created}</time>
			{updated !== created && <time>Updated: {updated}</time>}
			<div dangerouslySetInnerHTML={createMarkup()}></div>
		</div>
	);
};

export default PostFull;
