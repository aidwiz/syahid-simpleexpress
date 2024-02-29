const User = require('../models/user');

const allUsersLookup = async (req, res, next) => {
  try {
    console.log('reached allUsersLookup');
    const allUsers = await User.find();
    req.allUsers = allUsers;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = allUsersLookup;
