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
	console.log("this one sure works");
	Code.findOne({ email: req.user.username }, (err, code) => {
		console.log(err);
		console.log(code);
		console.log(req.user);

		// send a new code if code has expired
		if (code === null) {
			console.log("code is null");
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
		} else {
			mail(req.user.username, code.code, code._id);
		}
	});
});

// verify code
router.post("/secret", passport.authenticate("jwt", { session: false }), (req, res) => {
	console.log(req.user);
});

// router.post("/secret", passport.authenticate("jwt", { session: false }), (req, res) => {
// 	console.log(req.user);
// 	if (err) {
// 		console.log(err);
// 		return next(err);
// 	}

// 	Code.findOne({ email: req.user.username }, (err, code) => {
// 		if (err) {
// 			return next(err);
// 		}
// 		if (req.body.secret === code.code) {
// 			User.updateOne({ _id: req.user._id }, { status: "verified" }, (err) => {
// 				if (err) {
// 					return next(err);
// 				}
// 				res.json("success");
// 			});
// 		}
// 	});
// });

module.exports = router;
