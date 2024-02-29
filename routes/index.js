var express = require('express');
var router = express.Router();

/* Home page GET */
router.get('/', function(req, res, next) {
  res.render('index', { loggedUser: 'Syahid' });
});

/* Error Test Segment GET - leave here for testing purposes only */
router.get('/error1', (req, res) => {
  // this will get caught, displayed on browser
  throw new Error("this is an error message /error1");
});

router.get('/error3', async (req, res, next) => {
  // solution to error2
  // run the next function directly instead of throwing an error
  // ensures that the error middleware is called with the error
  const error = new Error("this is an error thrown by /error3 async");
  error.status = 500;
  return next(error);
});
/* End of Error Test Segment */

module.exports = router;
