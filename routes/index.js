const express = require('express');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.send('home');
});

router.put('/edit-user', (req, res)=>{
  const {valueToEdit, userToEdit} = req.body;
  User.updateOne({username: req.user.username}, {[valueToEdit]: userToEdit[valueToEdit]})
    .then((result)=>{
      res.send(result);
    })
    .catch((err)=>{
      res.send(err);
    });
});

router.post('/addrecipe', (req, res)=>{
  const {title, ingredients, process, difficulty, duration, image} = req.body;
  Recipe.create({title, ingredients, process, difficulty, duration, author: req.user.username, image})
    .then((result)=>{
      res.send(result);
    })
    .catch((err)=>{
      res.send(err);
    });
});

router.get('/alluserrecipes', (req, res)=>{
  if(req.isAuthenticated()){
    Recipe.find({author: req.user.username})
      .then((result)=>{
        res.send(result);
      })
      .catch((err)=>{
        res.send(err);
      });
  }
});

module.exports = router;
