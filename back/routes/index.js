const bcrypt = require("bcryptjs");
var express = require("express");
var router = express.Router();
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Post");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

/* GET users listing. */
router.get("/", function (req, res) {
	res.send("index");
});

/* GET user profile. Protected route */
router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
	res.json({ name: req.user.name, id: req.user._id });
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
	Post.find({ published: true }).populate('user', 'name').exec((err, list_posts) => {
		if (err) {
			return next(err);
		}
		console.log(list_posts);
		res.json(list_posts);
	});
});

// GET individual post
router.get("/posts/:postId", function (req, res) {
	res.send("individual post");
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
	res.send("comments for post");
});

// GET individual comment
router.get("/posts/:postId/comments/:commentId", function (req, res) {
	res.send("individual comment");
});

// GET form to create new comment.
// POST form to create new comment.
router.post(
	"/posts/:postID/comments",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {}
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
