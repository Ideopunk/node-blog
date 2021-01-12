const PostLink = ({ title, preview, created, name, id, setDisplay }) => {
	return (
		<div onClick={() => setDisplay(id)} className="post-link mrg">
			<div className="flex spread">
				<h2>{title}</h2>
				<div>
					<p>{name}</p>
					<time>{created}</time>
				</div>
			</div>
			<div className="preview mrg-top">{preview}</div>
		</div>
	);
};

export default PostLink;
