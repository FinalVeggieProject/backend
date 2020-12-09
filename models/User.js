const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema ({
  username: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  image: {type: String},
  birthdate: {type: Date},
  name: {type: String},
  lastName: {type: String}
});

const User = mongoose.model('User', userSchema);

module.exports = User;