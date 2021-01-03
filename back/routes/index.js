const bcrypt = require("bcryptjs");
var express = require("express");
var router = express.Router();
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

/* GET users listing. */
router.get("/", function (req, res) {
	res.send("index");
});

/* GET user profile. Protected route */
router.get("/user", passport.authenticate("jwt", { session: false }), (req, res) => {
	
	Post.find({"user": req.user._id}).then((posts) => {
		res.json({ name: req.user.name, id: req.user._id, posts: posts });
	});
});

/* POST login. */
router.post("/login", function (req, res) {
	console.log(req.body);
	passport.authenticate("local", { session: false }, (err, user, info) => {
		console.log("authenticate section");
		if (err || !user) {
			console.log("aint right");
			console.log(err);
			console.log(user);
			console.log(info);
			return res.status(400).json({
				message: "Something is not right",
				user: user,
			});
		}
		req.login(user, { session: false }, (err) => {
			console.log("req login");
			if (err) {
				console.log(err);
				res.send(err);
			}
			// generate a signed json web token with the contents of user object and return it in the response
			const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: "1d" });
			console.log(user);
			console.log(token);
			return res.json({ token });
		});
	})(req, res);
});

// POST signup
router.post(
	"/sign-up",
	[
		body("name").trim().isLength({ min: 1 }).escape(),
		body("username").trim().isLength({ min: 1 }).escape(),
		body("password").isLength({ min: 8 }),
		body("confirm")
			.isLength({ min: 8 })
			.custom((value, { req }) => value === req.body.password),
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
			if (err) {
				return next(err);
			}
			const user = new User({
				name: req.body.name,
				username: req.body.username,
				password: hashedPassword,
			}).save((err) => {
				if (err) {
					console.log(err);
					return next(err);
				}
				res.redirect("/");
			});
		});
	}
);

// BLOG POSTS

// GET all posts
router.get("/posts", function (req, res, next) {
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
router.get("/posts/:postId", function (req, res, next) {
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
router.post("/posts", passport.authenticate("jwt", { session: false }), [
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
router.put("/posts/:postID", passport.authenticate("jwt", { session: false }), (req, res) => {});

// DESTROY post.
router.delete("/posts/:postId", passport.authenticate("jwt", { session: false }), (req, res) => {});

// COMMENTS

// GET all comments for post
router.get("/posts/:postId/comments", function (req, res) {
	Comment.find({ post: req.params.postId })
		.populate("user", "name")
		.exec((err, list_comments) => {
			if (err) {
				return next(err);
			}
			console.log(list_comments);
			res.json(list_comments);
		});
});

// GET individual comment
router.get("/posts/:postId/comments/:commentId", function (req, res) {
	Comment.findById(req.params.commentId)
		.populate("user", "name")
		.exec((err, item) => {
			if (err) {
				return next(err);
			}

			res.json(item);
		});
});

// GET form to create new comment.
// POST form to create new comment.
router.post(
	"/posts/:postID/comments",
	passport.authenticate("jwt", { session: false }),
	(req, res) => [
		body("text", "Write something!").trim().isLength({ min: 1 }).escape(),
		(req, res, next) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			const comment = new Comment({
				post: req.params.postId,
				text: req.body.text,
				user: req.user._id,
			});

			console.log(comment);
			comment.save((err) => {
				if (err) {
					return next(err);
				}
				res.redirect(`/posts/${req.params.postId}`);
			});
		},
	]
);

// GET edit form for a comment.
// UPDATE comment.
router.put(
	"/posts/:postID/comments/:commentId",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {}
);

// DESTROY comment.
router.delete(
	"/posts/:postId/comments/:commentId",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {}
);

module.exports = router;
