import React, { useEffect, useState } from "react";
import axios from "./config/axios";
import Commenter from "./Commenter";

const PostFull = ({ postID, setDisplay, token, verification }) => {
	axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

	const [title, setTitle] = useState("");
	const [text, setText] = useState("");
	const [created, setCreated] = useState("");
	const [updated, setUpdated] = useState("");
	const [name, setName] = useState("");
	const [comments, setComments] = useState([]);

	useEffect(() => {
		axios
			.get(`/posts/${postID}`)
			.then((response) => {
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
				setComments(response.data);
			})
			.catch((err) => console.log(err));
	}, [postID]);

	const getComments = () => {
		axios
			.get(`/posts/${postID}/comments`)
			.then((response) => setComments(response.data))
			.catch((err) => console.log(err));
	};

	function createMarkup() {
		return { __html: text };
	}

	const handleCoverClick = (e) => {
		if (e.target.getAttribute("name") === "cover") {
			setDisplay("");
		}
	};

	const commentDisplay = (array) => {
		return array.map((comment) => (
			<div
				key={`${comment.user.name}${comment.create_date_formatted}`}
				className="pad mrg-top comment"
			>
				<p>{comment.user.name}</p>
				<time className="pad-bot">{comment.create_date_formatted}</time>
				<p>{comment.text}</p>
			</div>
		));
	};
	return (
		<div name="cover" className="cover" onClick={handleCoverClick}>
			<div className="post-full-container appear">
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
					<div className="mrg-top pad pad-top">
						<h3>Comments</h3>
						{commentDisplay(comments)}
					</div>
					{token && verification ? (
						<Commenter postID={postID} token={token} getComments={getComments}/>
					) : token ? (
						<div className="center mrg-top">Please sign in in order to comment</div>
					) : (
						<div className="center mrg-top">Please verify in order to comment</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PostFull;
