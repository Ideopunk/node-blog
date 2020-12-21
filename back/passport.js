require("dotenv").config();
const passport = require("passport");
const passportJWT = require("passport-jwt");

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;

passport.use(
	new LocalStrategy((username, password, done) => {
		User.findOne({ username: username }),
			(err, user) => {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, { msg: "Incorrect userrname" });
				}

				bcrypt.compare(password, user.password, (err, res) => {
					if (res) {
						return done(null, user);
					} else {
						return done(null, false, { msg: "Incorrect password" });
					}
				});
			};
	})
);

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
		},
		function (jwtPayload, cb) {
			//find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
			return UserModel.findOneById(jwtPayload.id)
				.then((user) => {
					return cb(null, user);
				})
				.catch((err) => {
					return cb(err);
				});
		}
	)
);
