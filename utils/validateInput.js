const { body } = require('express-validator');

// Reference:https://express-validator.github.io/docs/api/validation-chain

let validateInput = [
  body('firstName', "First name is missing, accept alphabet only").trim().notEmpty().escape().isAlpha('en-US', {ignore: ' '}),
  body('lastName', "Last name is missing, accept alphabet only.").trim().notEmpty().escape().isAlpha('en-US', {ignore: ' '}),
  body('username', "Username is missing, accept alphabet and numbers only").trim().notEmpty().escape().isAlphanumeric(),
  body('email', "E-mail address missing.").trim().notEmpty().escape().isEmail().normalizeEmail({all_lowercase:true}),
  body('gender', "Gender selection is missing").escape(),
  body('course', "Course selection is missing").escape(),
];

module.exports = validateInput;




