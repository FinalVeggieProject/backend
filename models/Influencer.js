const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const influencerSchema = new Schema ({
  username: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true}
})

const Influencer = mongoose.model('Influencer', influencerSchema)

mongoose.model.exports = Influencer