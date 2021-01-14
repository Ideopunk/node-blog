var express = require("express");
var router = express.Router({ mergeParams: true });
const User = require("../models/User");
const Code = require("../models/Code");
const passport = require("passport");
const { v4: uuidv4 } = require("uuid");
const mail = require("../mail");
require("../passport");
require("../mail");

// send a new code
router.post("/", passport.authenticate("jwt", { session: false }), (req, res) => {
	console.log("/auth");
	Code.findOne({ email: req.user.username }, (err, code) => {
		// send a new code if code has expired
		if (code === null) {
			const secret = uuidv4();

			const code = new Code({
				email: req.user.username,
				code: secret,
			}).save((err, doc) => {
				if (err) {
					return next(err);
				}

				mail(req.user.username, secret, (response) => {
					console.log(response);
					if (response.rejected.length < 1) {
						res.json("success");
					} else {
						res.json("failure");
					}
				});
			});
		} else {
			mail(req.user.username, code.code, (response) => {
				console.log(response);

				if (response.rejected.length < 1) {
					res.json("success");
				} else {
					res.json("failure");
				}
			});
		}
	});
});

// verify code
router.post("/secret", passport.authenticate("jwt", { session: false }), (req, res, next) => {
	Code.findOne({ email: req.user.username }, (err, code) => {
		if (err) {
			return next(err);
		}
		if (code && req.body.secret === code.code) {
			User.updateOne({ _id: req.user._id }, { status: "verified" }, (err) => {
				if (err) {
					return next(err);
				}
				res.json("success");
			});
		} else {
			res.json("invalid code");
		}
	});
});

module.exports = router;
