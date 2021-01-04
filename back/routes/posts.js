var express = require("express");
var router = express.Router();
const passport = require("passport");
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
			res.redirect("/");
		});
	},
]);

// GET edit form for a post.
// UPDATE post.
router.put("/:postID", passport.authenticate("jwt", { session: false }), (req, res) => {});

// DESTROY post.
router.delete("/:postId", passport.authenticate("jwt", { session: false }), (req, res) => {});

module.exports = router;
