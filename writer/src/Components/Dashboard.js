import React, { useState } from "react";
import { ReactComponent as Trash } from "../Assets/trash-outline.svg";
import axios from "axios";
import CodeScreen from "./CodeScreen";
axios.defaults.baseURL = "http://localhost:8080";

const Dashboard = ({ posts, updateID, setUpdateID, token, verification, verifyEmail }) => {
	const [codeScreen, setCodeScreen] = useState(false);

	axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

	const handleClick = (e) => {
		console.log("changeover");
		setUpdateID(e.currentTarget.getAttribute("name"));
	};

	const handleTrash = (e) => {
		e.stopPropagation();
		console.log(e.currentTarget);
		axios
			.delete(`/posts/${e.currentTarget.getAttribute("data-id")}`)
			.then((response) => {
				console.log(response);
			})
			.catch((err) => console.log(err));
	};

	const postsJSX = posts.map((post) => (
		<li
			className={`post-link ${post.published ? "published" : "unpublished"} ${
				updateID === post._id ? "current" : ""
			}`}
			onClick={handleClick}
			name={post._id}
			key={post._id}
		>
			<div>
				<h2>{post.title}</h2>
				<time>{post.create_date_formatted_short}</time>
			</div>
			<Trash name="trash" data-id={post._id} onClick={handleTrash} />
		</li>
	));

	return (
		<ul className="dashboard">
			<li
				className="post-link"
				key="new"
				onClick={() => {
					setUpdateID("");
				}}
			>
				New Post
			</li>
			{postsJSX}
			{!verification && (
				<>
					<li className="post-link" onClick={verifyEmail}>
						Resend email
					</li>
					<li className="post-link" onClick={() => setCodeScreen(!codeScreen)}>
						Verify code
					</li>
				</>
			)}

			{codeScreen && <CodeScreen token={token} />}
		</ul>
	);
};

export default Dashboard;
