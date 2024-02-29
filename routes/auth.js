var express = require('express');
var router = express.Router();
const session = require('express-session');
const validateInput = require('../utils/validateInput');
const { matchedData, validationResult } = require('express-validator');
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
const User = require('../models/user');

// use passport local strategy
passport.use(User.createStrategy());

// To use with sessions
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});


/* Auth test page GET  */
router.get('/', function (req, res, next) {
  res.send(req.sessionID);
});

/* Register User GET */
router.get('/register', (req, res, next) => {
  res.render('register');
});

/* Register User POST */
router.post('/register', validateInput, async (req, res, next) => {
  const result = validationResult(req); 
  const validatedData = matchedData(req); 

  if (result.isEmpty()) { // if express-validator return no errors
    const newUser = new User({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      username: validatedData.username,
      email: validatedData.email,
      gender: validatedData.gender,
      course: validatedData.course,
    });

    // attempt registration via passport-local-mongoose
    try {
      await User.register(new User(newUser), req.body.password);
      console.log('user registration successful');
      res.redirect('/auth/login');
    } catch (err) { // if passport-local-mongoose failed, back to registration + error messages
      req.flash('warning', err.message);
      res.render('register', { user: newUser });
    }

  } else { // if express-validator errored, back to register form with user data + error messages
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      gender: req.body.gender,
      course: req.body.course,
    });

    errors = result.array({ onlyFirstError: true });
    let errorMessage = '';
    errors.forEach((error) => {
      errorMessage = errorMessage + error.msg + ' ; ';
    });
    req.flash('warning', errorMessage); 
    res.render('register', { user: newUser });
  }

});

/* Login Page GET  */
router.get('/login', (req, res, next) => {
  res.render('login');
});

/* Login Page POST */
router.post('/login', passport.authenticate('local', { failureRedirect: '/auth/login'}), (req, res, next) => {
  res.redirect('/users');
}); 

/* Test - Secret Page for Logged in Users GET */
router.get('/secret', connectEnsureLogin.ensureLoggedIn('/auth/login'), (req, res) => {
  let sessionData = {
    userSessionName: req.user.username,
    userSessionID: req.sessionID,
    userCookie: req.session.cookie.maxAge,
  }

  res.render('secretpage', { userdata: sessionData} );
});

/* Logout POST */
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err) };
    res.redirect('/auth/login');
  })
});

module.exports = router;