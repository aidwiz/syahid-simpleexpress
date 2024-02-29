var express = require('express');
var router = express.Router();
const User = require('../models/user');
const singleUserLookup = require('../utils/singleUserLookup');
const allUsersLookup = require('../utils/allUsersLookup')
const validateInput = require('../utils/validateInput');
const { matchedData, validationResult } = require('express-validator');
const connectEnsureLogin = require('connect-ensure-login');

/* Users Landing Page GET */
router.get('/', connectEnsureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render('userlanding');
});


/* List All Users GET */
router.get('/allusers', connectEnsureLogin.ensureLoggedIn('/auth/login'), allUsersLookup, (req, res, next) => {
  try {
    res.render('userlist', { users: req.allUsers });
  } catch (err) {
    return next(err);
  }
});

/* Edit Single User Based on ID number GET*/
router.get('/edituser/:id', connectEnsureLogin.ensureLoggedIn('/auth/login'), singleUserLookup, (req, res, next) => {
  try {
    res.render('useredit', { user: req.user });
  } catch(err) {
    return next(err);
  }
});


/* Edit Single User Based on ID number PATCH*/
router.patch('/update/:id', validateInput, async (req, res, next) => {
  const result = validationResult(req);
  const validatedData = matchedData(req);

  if (result.isEmpty()) {
    const id = req.params.id;
    const updatedData = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      username: validatedData.username,
      email: validatedData.email,
      gender: validatedData.gender,
      course: validatedData.course,
    };
    const options = { new: true };

    try {
      await User.findByIdAndUpdate(id, updatedData, options);
      res.redirect('/users/allusers');
    } catch (err) {
      return next(err);
    }

  } else {
    // return back to edit user page for the particular user (can be further improved by showing express-flash with error messages)
    res.redirect(`/users/edituser/${req.params.id}`);
  };

});


/* Show a single user details GET */
router.get('/userdetails/:id', connectEnsureLogin.ensureLoggedIn('/auth/login'), singleUserLookup, (req, res, next) => {
  try {
    res.render('userdetails', { user: req.user });
  } catch (err) {
    return next(err);
  }
});


/* Delete list all users GET */
router.get('/delete', connectEnsureLogin.ensureLoggedIn('/auth/login'), allUsersLookup, (req, res, next) => {
  try {
    res.render('userdelete', { users: req.allUsers });
  } catch (err) {
    return next(err);
  }
});


/* Delete the user selected on above /users/delete DELETE*/
router.delete('/userdelete/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await User.findByIdAndDelete(id);
    res.redirect('/users/delete');
  } catch (err) {
    // res.status(400).json({ message:err.message });
    return next(err);
  }
});

module.exports = router;