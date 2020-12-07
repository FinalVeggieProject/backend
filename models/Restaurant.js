const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const restaurantSchema = new Schema ({
  username: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true}
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema)

module.exports = Restaurant