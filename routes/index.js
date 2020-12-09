const express = require('express');
const bcrypt  = require('bcryptjs');
const Recipe  = require('../models/Recipe');
const User    = require('../models/User');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.send('home');
});

router.put('/edit-user', (req, res)=>{
  const {valueToEdit, userToEdit} = req.body;
  if(valueToEdit==='password'){
    const salt = bcrypt.genSaltSync(10);
		const hashPass = bcrypt.hashSync(userToEdit[valueToEdit], salt);
    User.updateOne({username: req.user.username}, {[valueToEdit]: hashPass})
      .then((result)=>{
        res.send(result);
      })
      .catch((err)=>{
        res.send(err);
      });
  } else {
    User.updateOne({username: req.user.username}, {[valueToEdit]: userToEdit[valueToEdit]})
      .then((result)=>{
        res.send(result);
      })
      .catch((err)=>{
        res.send(err);
      });
  }
});

router.put('/edit-recipe', (req, res)=>{
  const {valueToEdit, recipeToEdit} = req.body;
 
    Recipe.updateOne({_id: recipeToEdit._id}, {[valueToEdit]: recipeToEdit[valueToEdit]})
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

router.get('/recipe/:id', (req, res)=>{
  const id = req.params.id;
  Recipe.find({_id: id})
    .then((result)=>{
      console.log(result);
      res.send(result);
    })
    .catch((err)=>{
      res.send(err);
    })
});

module.exports = router;
