require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
const cors = require("cors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("./passport");
const mongoose = require("mongoose");

const index = require("./routes/index");
const user = require("./routes/user");

const passport = require("passport");
require("./passport");

var app = express();

//datebase
mongoose.connect(process.env.MONGURL, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

// middleware
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.listen(8080, () => console.log("app listening on port 8080"));

// routes
app.use("/", index);
app.use("/user", passport.authenticate("jwt", { session: false }), user);

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
	res.send("error");
});

module.exports = app;
