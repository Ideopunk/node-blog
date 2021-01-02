const Post = ({ title, text, created, updated }) => {
	function createMarkup() {
		return { __html: text };
	}

	return (
		<div className="post">
			<h2>{title}</h2>
			<time>{created}</time>
			{updated !== created && <time>Updated: {updated}</time>}
			<div dangerouslySetInnerHTML={createMarkup()}></div>
		</div>
	);
};

export default Post;
