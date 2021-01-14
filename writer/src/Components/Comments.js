import React, { useState, useEffect } from "react";
import { ReactComponent as Trash } from "../Assets/trash-outline.svg";
import axios from "./config/axios";

const Comments = ({ postID, token }) => {
	const [comments, setComments] = useState([]);

	axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

	useEffect(() => {
		const deleteComment = (id) => {
			axios.delete(`/posts/${postID}/comments/${id}`);
			populate();
		};

		const populate = () => {
			setComments("")
			axios
				.get(`/posts/${postID}/comments`)
				.then((response) => {
					const jsxData = response.data.map((comment) => (
						<div key={comment._id} className="comment mrg">
							<div className="comment-top">
								<div>
									<h2>{comment.user.name}</h2>
									<time>{comment.create_date_formatted}</time>
								</div>
								<div
									onClick={() => deleteComment(comment._id)}
									className=" icon-container trash"
								>
									<Trash />
								</div>
							</div>
							<p className="mrg-top">{comment.text}</p>
						</div>
					));
					setComments(jsxData);
				})
				.catch((err) => console.log(err));
		};

		populate();
	}, [postID]);

	return (
		<div className="comments appear slide">
			<h2 className="mrg-bot">Comments</h2>
			{comments}
		</div>
	);
};

export default Comments;
