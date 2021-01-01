import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect, useState } from "react";

const MCE = ({name}) => {
	const [content, setContent] = useState("");

	const handleEditorChange = (newContent, editor) => {
		console.log("Content was updated:", newContent);
		setContent(newContent);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (name) {
			console.log(content);

		} else {
			alert("You must be signed in in order to post!")
		}
	};

	return (
		<form onSubmit={handleSubmit}>
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
			<input type="submit" value="Post" />
		</form>
	);
};

export default MCE;