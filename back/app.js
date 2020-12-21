const bcrypt = require("bcryptjs");
require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var sassMiddleware = require("node-sass-middleware");
const session = require("express-session");
require("./passport");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { body, validationResult } = require("express-validator");

const index = require("./routes/index");
const user = require("./routes/user");
const auth = require("./routes/auth");

const passport = require("passport");

var app = express();

//datebase
const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");

mongoose.connect(process.env.MONGURL, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

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

// security
app.use("/", index);
app.use("/user", passport.authenticate("jwt", { session: false }), user);
app.use("/auth", auth);

app.listen(8080, () => console.log("app listening on port 8080"));
app.use("/", index);

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
