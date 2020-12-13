const express = require('express');
const bcrypt  = require('bcryptjs');
const Recipe  = require('../models/Recipe');
const Restaurant = require('../models/Restaurant')
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
 console.log(recipeToEdit.id);
    Recipe.updateOne({_id: recipeToEdit.id}, {[valueToEdit]: recipeToEdit[valueToEdit]})
      .then(()=>{
        Recipe.find({_id: recipeToEdit.id})
          .then((result)=>{
            res.send(result);
          });
      })
      .catch((err)=>{
        res.send(err);
      });
});

router.put('/edit-restaurant', (req, res)=>{
  const {valueToEdit, restaurantToEdit} = req.body;
    Restaurant.updateOne({_id: restaurantToEdit.id}, {[valueToEdit]: restaurantToEdit[valueToEdit]})
      .then(()=>{
        Restaurant.find({_id: restaurantToEdit.id})
          .then((result)=>{
            res.send(result);
          });
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

router.post('/recipe/:id', (req, res)=>{
  const {id} = req.body;
  Recipe.deleteOne({_id: id})
    .then((result)=>{
      res.send(result);
    })
    .catch((err)=>{
      res.send(err);
    })
});

router.post('/restaurant/:id', (req, res)=>{
  const {id} = req.body;
  Restaurant.deleteOne({_id: id})
    .then((result)=>{
      res.send(result);
    })
    .catch((err)=>{
      res.send(err);
    })
});

router.post('/addrestaurant', (req,res)=>{
  const {name, address, schedule, contact, typeOfFood, recomendations, webUrl, image} = req.body;
  Restaurant.create({name, owner: req.user.id, address, schedule, contact, typeOfFood, recomendations, webUrl, image})
    .then((result)=>{
      res.send(result);
    })
    .catch((err)=>{
      res.send(err)
    })
})

router.get('/alluserrestaurants', (req,res)=>{
  if(req.isAuthenticated()){
    Restaurant.find({owner: req.user._id})
    .then((result)=>{
      res.send(result);
    })
    .catch((err)=>{
      res.send(err)
    })
  }
})

router.get('/restaurant/:id', (req, res)=>{
  const id = req.params.id;
  Restaurant.find({_id: id})
    .then((result)=>{
      console.log(result);
      res.send(result);
    })
    .catch((err)=>{
      res.send(err);
    })
});

module.exports = router;
