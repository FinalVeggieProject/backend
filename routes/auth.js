const express = require('express');
const authRoutes  = express.Router();

const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { json } = require('body-parser');

authRoutes.post('/signup', (req, res) => {
  const {username, password, email, image} = req.body;

	if (!username || !password || !email) {
    res.send({ message: 'Nombre de usuario, e-amil y contraseña son obligatorios, por favor introdúcelos.' })
		return;
  }
  
  const passwordLettersArr = [] 
  let upperCounter = 0;
  password.split('').forEach((letter)=>{
    passwordLettersArr.push(letter.toUpperCase());
  })
  passwordLettersArr.forEach((letter)=>{
    if (password.includes(letter)) {
      upperCounter++;
    }
  })
  if(upperCounter>0){
    if (password.length < 7 ) {
      res
        .send({ message: 'La contraseña debe tener al menos 8 caracteres y una mayúscula!' });
      return;
    }
  } else {
    res
        .send({ message: 'La contraseña debe tener al menos 8 caracteres y una mayúscula!' });
      return;
  }


	User.findOne({ username }, (err, foundUser) => {
		if (err) {
			res.send({ message: 'Algo salió mal, por favor vuelve a intentarlo.' });
			return;
		}

		if (foundUser) {
			res.send({ message: 'Este nombre de usuario ya existe, elige otro por favor.' });
			return;
		}

		const salt = bcrypt.genSaltSync(10);
		const hashPass = bcrypt.hashSync(password, salt);

		const aNewUser = new User({
			username: username,
      password: hashPass,
      email: email,
      birthdate: '',
      name: '',
      lastName: '',
      image: image
		});        


		aNewUser.save((err) => {
			if (err) {
				res.send({ message: 'Algo salió mal, por favor vuelve a intentarlo.' });
				return;
			}
			// Automatically log in user after sign up
			// .login() here is actually predefined passport method
			req.login(aNewUser, (err) => {
        if (err) {
          res.send({ message: 'Login after signup went bad.' });
					return;
				}
        
        // 	// Send the user's information to the frontend
        // 	// We can use also: res.status(200).json(req.user);
        res.status(200).json(aNewUser);
			});
		});
	});
});

authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
      if (err) {
          res.send({message: 'Fallo al iniciar sesión, por favor inténtalo de nuevo.'});
          return;
      }
      if (!theUser) {
          res.send({message: failureDetails.message});
          return;
      }
      req.login(theUser, err => err ? res.status(500).json({ message: 'Session error' }) : res.status(200).json(theUser));
  })(req, res, next)
})

authRoutes.post('/logout', (req, res, next) => {
  // req.logout() is defined by passport
  req.logout();
  res.send({message: 'Has salido de tu sesión.'})
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
