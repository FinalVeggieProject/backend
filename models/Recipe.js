const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const recipeSchema = new Schema ({
  title: {type: String},
  ingredients: {type: String},
  process: {type: String},
  difficulty: {type: Number},
  duration: {type: Number},
  author: {type: String},
  image: {type: String},
  date: {type: Date}
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;