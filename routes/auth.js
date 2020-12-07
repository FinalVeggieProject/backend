const express = require('express');
const authRoutes  = express.Router();

const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { json } = require('body-parser');

authRoutes.post('/signup', (req, res) => {
  const {username, password, email} = req.body;

	if (!username || !password || !email) {
    res.status(400).json({ message: 'Todos los campos son obligatorios, por favor introdúcelos.' })
		return;
  }
  
  const passwordLettersArr = [] 
  let upperCounter = 0;
  password.split('').forEach((letter)=>{
    passwordLettersArr.push(letter.toUpperCase());
  })
  console.log(passwordLettersArr);
  passwordLettersArr.forEach((letter)=>{
    if (password.includes(letter)) {
      upperCounter++;
    }
  })
  if(upperCounter>0){
    if (password.length < 7 ) {
      res
        .status(400)
        .json({ message: 'La contraseña debe tener al menos 8 caracteres y una mayúscula!' });
      return;
    }
  } else {
    res
        .status(400)
        .json({ message: 'La contraseña debe tener al menos 8 caracteres y una mayúscula!' });
      return;
  }


	User.findOne({ username }, (err, foundUser) => {
		if (err) {
			res.status(500).json({ message: 'Algo salió mal, por favor vuelve a intentarlo.' });
			return;
		}

		if (foundUser) {
			res.status(400).json({ message: 'Este nombre de usuario ya existe, elige otro por favor.' });
			return;
		}

		const salt = bcrypt.genSaltSync(10);
		const hashPass = bcrypt.hashSync(password, salt);

		const aNewUser = new User({
			username: username,
      password: hashPass,
      email: email
		});        console.log(req.user);


		aNewUser.save((err) => {
			if (err) {
				res.status(400).json({ message: 'Algo salió mal, por favor vuelve a intentarlo.' });
				return;
			}
			// Automatically log in user after sign up
			// .login() here is actually predefined passport method
			req.login(aNewUser, (err) => {
        if (err) {
          res.status(500).json({ message: 'Login after signup went bad.' });
					return;
				}
        
        // 	// Send the user's information to the frontend
        // 	// We can use also: res.status(200).json(req.user);
        res.status(200).json(aNewUser);
			});
		});
	});
});

authRoutes.post('/login', passport.authenticate("local", {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}))

authRoutes.post('/logout', (req, res, next) => {
  // req.logout() is defined by passport
  req.logout();
  res.status(200).json({ message: 'Log out success!' });
});

authRoutes.get('/loggedin', (req, res, next) => {
  // req.isAuthenticated() is defined by passport
  if (req.isAuthenticated()) {
      res.status(200).json(req.user);
      return;
  }
  res.json({ });
});

module.exports = authRoutes;
