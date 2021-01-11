var express = require("express");
var router = express.Router({ mergeParams: true });
const User = require("../models/User");
const Code = require("../models/Code");
const passport = require("passport");
const { v4: uuidv4 } = require("uuid");
require("../passport");

// send a new code
router.post("/", passport.authenticate("jwt", { session: false }), (req, res) => {
	Code.findOne({ email: req.user.username }, (err, code) => {
		console.log(err);
		console.log(req.user);

		// send a new code if code has expired
		if (err.msg === "we ain't got that code anymore") {
			const secret = uuidv4();

			const code = new Code({
				email: req.user.username,
				code: secret,
			}).save((err, doc) => {
				if (err) {
					console.log(err);
					return next(err);
				}

				mail(req.user.username, secret, doc._id);
			});
		}
	});
});

// verify code
router.get("/:id/:secret", (req, res) => {
	User.findById(req.params.id, (err, user) => {
		if (err) {
			return next(err);
		}

		Code.findOne({ email: user.username }, (err, code) => {
			if (err) {
				return next(err);
			}
			if (req.params.secret === code.code) {
				User.update({ _id: req.params.id }, { status: "verified" }, (err) => {
					if (err) {
						return next(err);
					}
					res.redirect("/");
				});
			}
		});
	});
});

module.exports = router;
