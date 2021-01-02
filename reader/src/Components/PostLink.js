const PostLink = ({ title, preview, created, name, id, setDisplay }) => {
	return (
		<div onClick={() => setDisplay(id)} className="post-link">
			<h2>{title}</h2>
			<p>{name}</p>
			<time>{created}</time>
			<div>{preview}</div>
		</div>
	);
};

export default PostLink;
