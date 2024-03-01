var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('express-flash');
const { v4: uuidv4 } = require('uuid');
const passport = require('passport');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testRouter = require('./routes/test');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));


app.use(session({
  genid: function (req) {
    return uuidv4();
  },
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour cookie
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// router import
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/test', testRouter);
app.use('/auth', authRouter);

// db and mongoose
mongoose.connect(process.env.DATABASE_URL); // old
const db = mongoose.connection;

db.on('error', (error) => {
  console.log(error);
}); // connect to db, throws error if connection fails

db.once('connected', () => {
  console.log("Database connected");
}); // run once, if successful show connected message above


// error handler 
const errorHandler = (err, req, res, next) => {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log('CATCHED BY DEFAULT ERROR HANDLER! : ', err.message);

  res.status(err.status || 500); // error codes will be sent to browser, "Inspect"
  res.render('error');
};

app.use(errorHandler);

// catchall for 404 - page not found
app.use((req, res, next) => {
  res.status(404);
  res.render('404');
});

module.exports = app;