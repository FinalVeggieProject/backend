require('dotenv').config();

const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const express       = require('express');
const favicon       = require('serve-favicon');
const hbs           = require('hbs');
const mongoose      = require('mongoose');
const logger        = require('morgan');
const path          = require('path');
const chalk         = require('chalk');
const session       = require('express-session');
const passport      = require('passport');
const cors          = require('cors');
const bcrypt        = require('bcryptjs');
const flash         = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy;

const User          = require('./models/User');

mongoose
.connect(`mongodb+srv://veggieapp:${process.env.PASS}@cluster0.kjwhe.mongodb.net/Veggie?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
.then(x => {
  console.log(chalk.greenBright.inverse.bold(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
})
.catch(err => {
  console.error('Error connecting to mongo', err)
});

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

//PASSPORT MIDDLEWARE
app.use(session({
  secret:"some secret goes here",
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(session({ secret: 'ourPassword', resave: true, saveUninitialized: true }));
app.use(flash());

//Middleware para serializar al usuario
passport.serializeUser((user, callback) => {
	callback(null, user._id);
});

//Middleware para des-serializar al usuario
passport.deserializeUser((id, callback) => {
	User.findById(id).then((user) => callback(null, user)).catch((err) => callback(err));
});

//Middleware del Strategy
passport.use(
	new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
    if(username==='' || password===''){
      return next(null, false, { message: 'Por favor, completa usuario y contraseña.' });
    }
		User.findOne({ username })
			.then((user) => {
				if (!user) {
					return next(null, false, { message: 'Usuario o contraseña incorrectos' });
				}
				if (!bcrypt.compareSync(password, user.password)) {
					return next(null, false, { message: 'Usuario o contraseña incorrectos' });
				}
				return next(null, user);
			})
			.catch((err) => next(err));
	})
);

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


//CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
app.use(cors({
  credentials: true,
  origin: ["https://veggieplanet.netlify.app"]
}));
app.use((req, res, next)=>{
  res.locals.user = req.user;
  next();
})


// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

module.exports = app;
