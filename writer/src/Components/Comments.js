import React, { useState, useEffect } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080";

const Comments = ({ postID }) => {
	const [comments, setComments] = useState([]);
	useEffect(() => {
		axios
			.get(`/posts/${postID}/comments`)
			.then((response) => {
				setComments(response.data);
			})
			.catch((err) => console.log(err));
	}, [postID]);

	return <div className="comments">{comments}</div>;
};

export default Comments;
