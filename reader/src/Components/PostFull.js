const PostFull = ({ title, preview, created, updated, name }) => {
	function createMarkup() {
		return { __html: preview };
	}

	return (
		<div className="post">
			<h2>{title}</h2>
			<p>{name}</p>
			<time>{created}</time>
			{updated !== created && <time>Updated: {updated}</time>}
			<div dangerouslySetInnerHTML={createMarkup()}></div>
		</div>
	);
};

export default PostFull;
