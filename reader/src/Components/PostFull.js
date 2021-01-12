import React, { useEffect, useState } from "react";
import axios from "axios";
import Commenter from "./Commenter";
axios.defaults.baseURL = "http://localhost:8080";

const PostFull = ({ postID, setDisplay, token }) => {
	axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

	const [title, setTitle] = useState("");
	const [text, setText] = useState("");
	const [created, setCreated] = useState("");
	const [updated, setUpdated] = useState("");
	const [name, setName] = useState("");
	const [comments, setComments] = useState([]);

	useEffect(() => {
		console.log(postID);
		axios
			.get(`/posts/${postID}`)
			.then((response) => {
				console.log(response.data);
				setTitle(response.data.title);
				setText(response.data.text);
				setCreated(response.data.create_date_formatted);
				setUpdated(response.data.update_date_formatted);
				setName(response.data.user.name);
			})
			.catch((err) => console.log(err));

		axios
			.get(`/posts/${postID}/comments`)
			.then((response) => {
				console.log(response);
				setComments(response.data);
			})
			.catch((err) => console.log(err));
	}, [postID]);

	function createMarkup() {
		return { __html: text };
	}

	const handleCoverClick = (e) => {
		if (e.target.getAttribute("name") === "cover") {
			console.log("got em!");
			setDisplay("");
		}
	};

	const commentDisplay = (array) => {
		console.log(array);
		return array.map((comment) => (
			<div key={`${comment.user.name}${comment.create_date_formatted}`} className="pad comment">
				<p>{comment.user.name}</p>
				<time className="pad-bot">{comment.create_date_formatted}</time>
				<p>{comment.text}</p>
			</div>
		));
	};
	return (
		<div name="cover" className="cover" onClick={handleCoverClick}>
			<div className="post-full">
				<h2>{title}</h2>
				<p>{name}</p>
				<div
					className="mrg-top mrg-bot pad-bot"
					dangerouslySetInnerHTML={createMarkup()}
				></div>

				<div className="bor-bot pad-bot">
					<time>Posted {created}</time>
					{updated !== created && <time>Updated {updated}</time>}
				</div>
				<div className="mrg-top pad-big">
					<h3 className="pad-bot">Comments</h3>
					{commentDisplay(comments)}
				</div>
				{token ? (
					<Commenter postID={postID} token={token} />
				) : (
					<div className="center">Please sign in in order to comment</div>
				)}
			</div>
		</div>
	);
};

export default PostFull;
