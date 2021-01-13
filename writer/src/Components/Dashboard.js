import React, { useEffect, useState } from "react";
import { ReactComponent as Trash } from "../Assets/trash-outline.svg";
import { ReactComponent as LockClosed } from "../Assets/lock-closed-outline.svg";
import { ReactComponent as LockOpened } from "../Assets/lock-open-outline.svg";
import axios from "./config/axios";
import Login from "./Login";
import Signup from "./Signup";
import CodeScreen from "./CodeScreen";

const Dashboard = ({
	posts,
	updateID,
	setUpdateID,
	token,
	setToken,
	verification,
	verifyEmail,
	signOut,
	name,
	refreshPosts,
	setMessage,
}) => {
	const [codeScreen, setCodeScreen] = useState(false);
	const [menu, setMenu] = useState("");

	axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

	useEffect(() => {
		setMenu("");
	}, [token]);

	const handleClick = (e) => {
		setUpdateID(e.currentTarget.getAttribute("name"));
	};

	const handlePublish = (e) => {
		e.stopPropagation();
		console.log(e.target);
		const status = e.currentTarget.getAttribute("data-status");
		axios
			.post(`/posts/${e.currentTarget.getAttribute("data-id")}/publish`)
			.then((response) => {
				console.log(response);
				refreshPosts();
				if (status === "false") {
					setMessage("Your post has been published!");
				} else {
					setMessage("Your post has been hidden!");
				}
			})
			.catch((err) => console.log(err));
	};

	const handleTrash = (e) => {
		e.stopPropagation();
		console.log(e.currentTarget);
		axios
			.delete(`/posts/${e.currentTarget.getAttribute("data-id")}`)
			.then((response) => {
				console.log(response);
				refreshPosts();
				setMessage("Your pust has been deleted!");
			})
			.catch((err) => console.log(err));
	};

	const postsJSX = posts.map((post) => (
		<div
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
			<div className="right">
				<div
					className="dash-icon icon-container"
					onClick={handlePublish}
					data-id={post._id}
					data-status={post.published}
				>
					{post.published ? <LockOpened /> : <LockClosed />}
				</div>
				<div className="dash-icon icon-container">
					<Trash name="trash" data-id={post._id} onClick={handleTrash} />
				</div>
			</div>
		</div>
	));

	return (
		<div className="dashboard">
			<div>
				<div
					className="post-link bor-bot"
					key="new"
					onClick={() => {
						setUpdateID("");
					}}
				>
					New Post
				</div>
				{postsJSX}
			</div>

			<div className="bor-top">
				{name && <div className="post-link">{name}'s posts</div>}
				{!verification && token && (
					<>
						<div className="post-link" onClick={verifyEmail}>
							Resend email
						</div>
						<div className="post-link" onClick={() => setCodeScreen(!codeScreen)}>
							Verify code
						</div>
					</>
				)}
				{token ? (
					<div className="post-link" onClick={signOut}>
						Sign out
					</div>
				) : (
					<>
						<div className="post-link" onClick={() => setMenu("signup")}>
							Sign up
						</div>

						<div className="post-link" onClick={() => setMenu("login")}>
							Log in
						</div>
					</>
				)}
				{codeScreen && <CodeScreen token={token} setCodeScreen={setCodeScreen} />}
				{menu === "signup" ? (
					<Signup setMenu={setMenu} />
				) : menu === "login" ? (
					<Login setMenu={setMenu} token={token} setToken={setToken} />
				) : (
					""
				)}
			</div>
		</div>
	);
};

export default Dashboard;
