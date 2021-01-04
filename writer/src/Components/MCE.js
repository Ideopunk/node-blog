import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080";

const MCE = ({ name, id, token, updateID, setUpdateID }) => {
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

	// useEffect(() => {
	// 	function storageUpdate() {
	// 		console.log('it happen')
	// 		localStorage.setItem("content", content);
	// 		localStorage.setItem("title", title);
	// 		localStorage.setItem("publish", publish);
	// 	}

	// 	let intervaler;

	// 	if (!updateID) {
	// 		console.log('okay')
	// 		intervaler = setInterval(storageUpdate, 5000);
	// 	} else {
	// 		console.log(updateID)
	// 	}

	// 	return clearInterval(intervaler);
	// }, [updateID, content, title, publish]);

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
						}
					})
					.catch((err) => console.log(err));
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
							setTitle("");
							setContent("");
							setPublish(false);
						}
					})
					.catch((err) => console.log(err));
			}
		} else {
			alert("You must be signed in in order to post!");
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="flex straight mrg">
				<input
					name="title"
					placeholder="Title"
					onChange={handleTitleChange}
					value={title}
				/>
				<div class="switch-container">
					Save draft
					<label class="switch">
						<input
							type="checkbox"
							checked={publish}
							onChange={() => setPublish(!publish)}
						/>{" "}
						<div></div>
					</label>
				</div>
			</div>

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

			<input
				type="submit"
				className="btn"
				value={!publish ? "Save" : updateID ? "Update" : "Post"}
			/>
		</form>
	);
};

export default MCE;
