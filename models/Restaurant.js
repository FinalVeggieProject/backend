const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const restaurantSchema = new Schema ({
  name: {type: String, required: true},
  owner: {type: String},
  address: {type: String},
  schedule: {type: String},
  contact: {type: Number},
  typeOfFood: {type: String},
  recomendations: {type: String},
  webUrl: {type: String}
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema)

module.exports = Restaurant