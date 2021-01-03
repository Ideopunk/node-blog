import React from "react";
import { ReactComponent as Trash } from "../Assets/trash-outline.svg";

const Dashboard = ({ posts, updateID, setUpdateID }) => {
	const handleClick = (e) => {
		if (e.target.name !== "trash") {
			console.log("changeover");
			setUpdateID(e.currentTarget.getAttribute("name"));
		}
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
			<Trash name="trash" />
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
		</ul>
	);
};

export default Dashboard;
