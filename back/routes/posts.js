var express = require("express");
var router = express.Router();
const passport = require("passport");
const async = require("async");
const { body, validationResult } = require("express-validator");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

// BLOG POSTS

// GET all posts
router.get("/", function (req, res, next) {
	Post.find({ published: true })
		.populate("user", "name")
		.exec((err, list_posts) => {
			if (err) {
				return next(err);
			}
			console.log(list_posts);
			res.json(list_posts);
		});
});

// GET individual post
router.get("/:postId", function (req, res, next) {
	Post.findById(req.params.postId)
		.populate("user", "name")
		.exec((err, item) => {
			if (err) {
				return next(err);
			}

			if (!item.published) {
				res.json("this post isn't published lmao how did you get in here!");
			}
			res.json(item);
		});
});

// GET form to create new post.
// POST form to create new post.
router.post("/", passport.authenticate("jwt", { session: false }), [
	body("title", "Posts require titles").trim().isLength({ min: 1 }).escape(),
	body("published", "Publication status must be specified").isBoolean(),
	(req, res, next) => {
		const errors = validationResult(req);

		if (req.user.status === "verified") {
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			// dompurify stuff...
			const window = new JSDOM("").window;
			const DOMPurify = createDOMPurify(window);

			const clean = DOMPurify.sanitize(req.body.content);

			const post = new Post({
				title: req.body.title,
				text: clean,
				user: req.user._id,
				published: req.body.published,
			});

			console.log(post);
			post.save((err) => {
				if (err) {
					return next(err);
				}
				res.json("success");
			});
		} else {
			return next({ message: "user is unverified" });
		}
	},
]);

// GET edit form for a post.
// UPDATE post.
router.put(
	"/:postID",
	passport.authenticate("jwt", { session: false }),
	[
		body("title", "Posts require titles").trim().isLength({ min: 1 }).escape(),
		body("published", "Publication status must be specified").isBoolean(),
		(req, res, next) => {
			console.log(req.body);

			Post.findById(req.params.postID).then((post) => {
				// make sure this user is allowed to do this...
				if (
					req.user._id.toString() === post.user.toString() &&
					req.user.status === "verified"
				) {
					console.log("we in");
					const errors = validationResult(req);

					if (!errors.isEmpty()) {
						return res.status(400).json({ errors: errors.array() });
					}

					// dompurify stuff...
					const window = new JSDOM("").window;
					const DOMPurify = createDOMPurify(window);

					const clean = DOMPurify.sanitize(req.body.content);

					const post = new Post({
						title: req.body.title,
						text: clean,
						user: req.user._id,
						published: req.body.published,
						_id: req.params.postID,
					});

					console.log(post);

					Post.findByIdAndUpdate(req.params.postID, post, {}, (err, thepost) => {
						if (err) {
							return next(err);
						}

						res.json("Success");
					});
				} else {
					return res.status(403);
				}
			});
		},
	]
	// if userID matches, update.
);

// DESTROY post.
router.delete("/:postID", passport.authenticate("jwt", { session: false }), (req, res) => {
	Post.findById(req.params.postID).then((results, err) => {
		console.log("we got in, delete");
		if (err) {
			return next(err);
		}

		if (req.user._id.toString() === results.user.toString() && req.user.status === "verified") {
			async.parallel(
				{
					a: (callback) => {
						Post.findByIdAndDelete(req.params.postID).exec(callback);
					},
					b: (callback) => {
						Comment.remove({ post: req.params.postID }).exec(callback);
					},
				},
				function (err, results) {
					if (err) {
						return next(err);
					}

					res.json("successful deletion");
				}
			);
		}
	});
});

// publish post

router.post(
	`/:postID/publish`,
	passport.authenticate("jwt", { session: false }),
	(req, res, next) => {
		Post.findById(req.params.postID).then((results, err) => {
			if (err) {
				return next(err);
			}

			if (
				req.user._id.toString() === results.user.toString() &&
				req.user.status === "verified"
			) {
				const post = new Post({
					title: results.title,
					text: results.text,
					user: req.user._id,
					published: !results.published,
					_id: req.params.postID,
				});

				Post.findByIdAndUpdate(req.params.postID, post, {}, (err, thepost) => {
					if (err) {
						return next(err);
					}

					res.json("Success");
				});
			}
		});
	}
);

module.exports = router;
