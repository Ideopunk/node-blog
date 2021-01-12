import React, { useState } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080";

const Commenter = ({ postID, token }) => {
	axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

	const [text, setText] = useState("");

	const handleChange = (e) => {
		setText(e.target.value);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		axios
			.post(`/posts/${postID}/comments`, { text: text })
			.then((response) => console.log(response))
			.catch((err) => console.log(err));
	};

	return (
		<form onSubmit={handleSubmit} className="pad-big commenter">
			<textarea
				cols="40"
				maxLength={500}
				rows={4}
				name="text"
				onChange={handleChange}
				placeholder="Share your thoughts"
				className="mrg-bot textarea"
			/>
			<input type="submit" value="Add comment" />
		</form>
	);
};

export default Commenter;
