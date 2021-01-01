import { Editor } from "@tinymce/tinymce-react";
import React, { useState } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080";

const MCE = ({ name, id, token }) => {
	const [content, setContent] = useState("");
	const [title, setTitle] = useState("");
	const [publish, setPublish] = useState(false);
	axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

	const handleEditorChange = (newContent, editor) => {
		console.log("Content was updated:", newContent);
		setContent(newContent);
	};

	const handleTitleChange = (e) => {
		setTitle(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (name) {
			console.log(content);
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
						setTitle("");
						setContent("");
						setPublish(false);
					}
				})
				.catch((err) => console.log(err));
		} else {
			alert("You must be signed in in order to post!");
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input name="title" placeholder="Title" onChange={handleTitleChange} value={title} />
			<Editor
				apiKey="bq2z3nnsyx6agpruod00p08tfiqb8jcv23htolhuud8bnu0z"
				value={content}
				init={{
					height: 500,
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
			<div class="container">
				<label class="switch">
					<input
						type="checkbox"
						checked={publish}
						onChange={() => setPublish(!publish)}
					/>{" "}
					<div></div>
				</label>
			</div>
			<input type="submit" value="Post" />
		</form>
	);
};

export default MCE;
