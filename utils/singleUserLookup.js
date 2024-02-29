const User = require('../models/user');

const singleUserLookup = async (req, res, next) => {
  try {
      console.log('reached singleUserLookup', req.params.id);
      const user = await User.findById(req.params.id);
      req.user = user;
      next();
  } catch (err) {
      next(err);
  }
};

module.exports = singleUserLookup;
