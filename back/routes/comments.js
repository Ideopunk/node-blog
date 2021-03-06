var express = require("express");
var router = express.Router({ mergeParams: true });
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const Comment = require("../models/Comment");

// COMMENTS

// GET all comments for post
router.get("/", function (req, res) {
	Comment.find({ post: req.params.postID })
		.populate("user", "name")
		.exec((err, list_comments) => {
			if (err) {
				return next(err);
			}
			res.json(list_comments);
		});
});

// GET individual comment
router.get("/:commentId", function (req, res) {
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
router.post("/", passport.authenticate("jwt", { session: false }), [
	body("text", "Write something!").trim().isLength({ min: 1 }).escape(),
	(req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		if (req.user.status === "verified") {
			const comment = new Comment({
				post: req.params.postID,
				text: req.body.text,
				user: req.user._id,
			});

			comment.save((err) => {
				if (err) {
					return next(err);
				}
				res.json(`success`);
			});
		} else {
			return res.json({ message: "user is not verified" });
		}
	},
]);

// DESTROY comment.
router.delete("/:commentId", passport.authenticate("jwt", { session: false }), (req, res) => {
	Comment.findById(req.params.commentId)
		.populate("post")
		.then((results, err) => {
			if (err) {
				return next(err);
			}

			if (
				req.user._id.toString() === results.user.toString() ||
				req.user._id.toString() === results.post.user.toString()
			) {
				Comment.findByIdAndDelete(req.params.commentId, (err) => {
					if (err) {
						return next(err);
					}

					res.json("succesful comment deletion");
				});
			}
		});
});

module.exports = router;
