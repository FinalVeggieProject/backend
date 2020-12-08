const express = require('express');
const User = require('../models/User');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.send('home');
});

router.put('/edit-user', (req, res)=>{
  const {valueToEdit, userToEdit} = req.body;
  // console.log([valueToEdit]);
  User.updateOne({username: req.user.username}, {[valueToEdit]: userToEdit[valueToEdit]})
    .then((result)=>{
      res.send(result);
    })
    .catch((err)=>{
      res.send(err);
    })
})

module.exports = router;
