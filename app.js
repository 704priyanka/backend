const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const connect = require("./config/database");
const StudentRoutes = require("./routes/studentRoutes");
const usersRouter = require("./routes/users");
const AgentRoutes = require("./routes/agentRoutes");
const CountriesRoutes = require("./routes/countries");
const Mailer = require("./routes/mailer");
const Reviews = require("./routes/reviews");
const Applications = require("./routes/applications");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
connect();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/student", StudentRoutes);
app.use("/agent", AgentRoutes);
app.use("/countries", CountriesRoutes);
app.use("/agent/reviews", Reviews);
app.use("/application", Applications);
app.use("/callback", Mailer);
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
