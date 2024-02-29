const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String },
  email: { type: String },
  gender: { type: String }, 
  course: { type: String },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
