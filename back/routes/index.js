const bcrypt = require("bcryptjs");
var express = require("express");
var router = express.Router();
const passport = require("passport");
require("../passport");
const mail = require("../mail");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Code = require("../models/Code");
const Post = require("../models/Post");
const { v4: uuidv4 } = require("uuid");

/* GET users listing. */
router.get("/", function (req, res) {
	res.send("index");
});

/* GET user profile. Protected route */
router.get("/user", passport.authenticate("jwt", { session: false }), (req, res) => {
	Post.find({ user: req.user._id }).then((posts) => {
		res.json({ name: req.user.name, id: req.user._id, posts: posts, status: req.user.status });
	});
});

/* POST login. */
router.post("/login", function (req, res) {
	passport.authenticate("local", { session: false }, (err, user, info) => {
		if (err || !user) {
			return res.status(400).json({
				message: "Something is not right",
				user: user,
			});
		}
		req.login(user, { session: false }, (err) => {
			if (err) {
				res.send(err);
			}
			// generate a signed json web token with the contents of user object and return it in the response
			const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: "1d" });
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
					return next(err);
				}

				// now send an email to verify

				const secret = uuidv4();

				const code = new Code({
					email: req.body.username,
					code: secret,
				}).save((err, doc) => {
					if (err) {
						return next(err);
					}

					mail(req.body.username, secret, doc._id);
				});
			});
		});
	}
);

module.exports = router;
