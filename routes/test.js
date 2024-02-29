var express = require('express');
var router = express.Router();

/* Test home page GET */
router.get('/', (req, res, next) => {
  res.render('testcode');
});

// Start a session GET
router.get('/sessionstart', (req, res, next) => {
  req.session.name = 'session in work: this thing you are reading is what is inside (req.session.name)';
  let mySession = { status: "session set up"};
  console.log(mySession);
  res.render('testcode', { mySession: mySession });
});

// Check if session if working GET
router.get('/sessioncheck', (req, res, next) => {
  var name = req.session.name;
  
  let mySession = { status: name };
  console.log(mySession);
  res.render('testcode', { mySession: mySession });
});

// Destroy a session GET
router.get('/sessiondestroy', (req, res, next) => {
  req.session.destroy();
  let destroyedSession = { status: "session destroyed, check again?" };

  console.log(destroyedSession);
  res.render('testcode', { mySession: destroyedSession });
});

module.exports = router;