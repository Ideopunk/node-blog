const PostLink = ({ title, preview, created, name }) => {


	return (
		<div className="post">
			<h2>{title}</h2>
			<p>{name}</p>
			<time>{created}</time>
			<div>{preview}</div>
		</div>
	);
};

export default PostLink;
