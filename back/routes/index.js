const bcrypt = require("bcryptjs");
var express = require("express");
var router = express.Router();
const passport = require("passport");
const { body, validationResult } = require("express-validator");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});

/* GET user profile. Protected route */
router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
	res.send(req.user);
});

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
				first_name: req.body.first,
				last_name: req.body.last,
				username: req.body.username,
				password: hashedPassword,
			}).save((err) => {
				if (err) {
					return next(err);
				}
				res.redirect("/");
			});
		});
	}
);

module.exports = router;
