const bcrypt = require("bcryptjs");
require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var sassMiddleware = require("node-sass-middleware");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { body, validationResult } = require("express-validator");

//datebase
const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment");

mongoose.connect(process.env.MONGURL, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const User = require("./models/User");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// security
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));

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

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

app.use(passport.initialize());
app.use(passport.session());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use *
	function (req, res, next) {
		res.locals.currentUser = req.user;
		next();
	};

app.use(cookieParser());
app.use(
	sassMiddleware({
		src: path.join(__dirname, "public"),
		dest: path.join(__dirname, "public"),
		indentedSyntax: false, // true = .sass and false = .scss
		sourceMap: true,
	})
);

app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => console.log("app listening on port 3000"));
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
