import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ReactComponent as LockClosed } from "../Assets/lock-closed-outline.svg";
import { ReactComponent as LockOpened } from "../Assets/lock-open-outline.svg";
axios.defaults.baseURL = "http://localhost:8080";

const MCE = ({
	name,
	id,
	token,
	updateID,
	setUpdateID,
	verification,
	setMessage,
	refreshPosts,
}) => {
	const [content, setContent] = useState("");
	const [title, setTitle] = useState("");
	const [publish, setPublish] = useState(false);

	axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

	useEffect(() => {
		if (updateID) {
			axios.get(`/posts/${updateID}`).then((response) => {
				setContent(response.data.text);
				setTitle(response.data.title);
				setPublish(response.data.published);
			});
		} else {
			setContent(localStorage.getItem("content") || "");
			setTitle(localStorage.getItem("title") || "");
			setPublish(localStorage.getItem("published") || false);
		}
	}, [updateID]);

	const handleEditorChange = (newContent, editor) => {
		console.log("Content was updated:", newContent);
		setContent(newContent);
	};

	const handleTitleChange = (e) => {
		setTitle(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (content) {
			if (token) {
				console.log(content);

				if (verification) {
					// updating
					if (updateID) {
						console.log("update");
						axios
							.put(`posts/${updateID}`, {
								user: id,
								title: title,
								content: content,
								published: publish,
							})
							.then((response) => {
								console.log(response);
								if (response.status === 200) {
									setUpdateID("");
									setTitle("");
									setContent("");
									setPublish(false);
									setMessage("Your post has been updated!");
									refreshPosts();
								}
							})
							.catch((err) => console.log(err));

						// posting
					} else {
						axios
							.post("/posts", {
								user: id,
								title: title,
								content: content,
								published: publish,
							})
							.then((response) => {
								console.log(response);
								if (response.status === 200) {
									if (publish) {
										setMessage("Your post has been published!");
									} else {
										setMessage("Your post has been saved!");
									}
									setTitle("");
									setContent("");
									setPublish(false);
									refreshPosts();
								}
							})
							.catch((err) => console.log(err));
					}
				} else {
					setMessage("You must be verified to post!");
				}
			} else {
				setMessage("Sign in to post!");
			}
		} else {
			setMessage("Write something!");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="appear">
			<label className="title-label">
				<span className="title-label-span">Title</span>
				<input
					className="title"
					name="title"
					onChange={handleTitleChange}
					value={title}
					maxLength={70}
					required
				/>
			</label>

			<Editor
				apiKey="bq2z3nnsyx6agpruod00p08tfiqb8jcv23htolhuud8bnu0z"
				value={content}
				required
				init={{
					height: 500,
					max_height: 500,
					menubar: false,
					plugins: [
						"advlist autolink lists link image charmap print preview anchor",
						"searchreplace visualblocks code fullscreen",
						"insertdatetime media table paste code help wordcount",
					],
					toolbar:
						"undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
				}}
				onEditorChange={handleEditorChange}
			/>

			<div className="save-div">
				<div onClick={() => setPublish(!publish)} className="lock-div">
					{publish ? <LockOpened /> : <LockClosed />}
				</div>
				<input
					type="submit"
					className="submit-button"
					value={
						!publish
							? "Save a private version"
							: updateID
							? "Update your post"
							: "Post to public"
					}
				/>
			</div>
		</form>
	);
};

export default MCE;
