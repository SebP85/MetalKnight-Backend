const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');
const helmet = require('helmet');//Protège l'en-tête
const morgan = require('morgan');//affiche les log en console
const cors = require('cors');//Configure l'en-tête 
//const csrf = require('csurf');//Protection contre les attaques CSRF
const cookieParser = require('cookie-parser');
const winston = require('./log/winston');//enregistre les logs dans un fichier
winston.info('API MetalKnight Lancée');

const mongoSanitize = require('express-mongo-sanitize');//contre les attaques noSQL pour mongodb

const auth = require('./middleware/auth');
const userRoutes = require('./routes/user');
const userTest = require('./routes/test');
const { loggers } = require('winston');
/*
const stuffRoutes = require('./routes/stuff');
const path = require('path');
const studentAPI = require('./routes/studentRoute');
*/

mongoose.Promise = global.Promise;
mongoose.set("useCreateIndex", true);//ajout
mongoose.connect(config.db.database,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => { if(process.env.DEVELOP === "true") {
    console.log('Connexion à MongoDB réussie !');
    winston.info('BDD OK');
  }
  })
  .catch(() => { if(process.env.DEVELOP === "true") {
    console.log('Connexion à MongoDB échouée !');
    winston.error('BDD NOK');
  }
  });

const app = express();

app.use(helmet());
app.use(morgan('dev'));

app.use(mongoSanitize());

var optionsCors = {
  origin: 'http://localhost:8080',
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content', 'Accept', 'Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  //maxAge: 3600,
};

app.use(cors(optionsCors));
/*app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});*/

/*var csrfProtection = csrf({ cookie: true });
var parseForm = express.urlencoded({
  extended: true
});*/
app.use(cookieParser('cookie'));//paramètres ?

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// API
app.use(function (req, res, next) {
  if(process.env.DEVELOP === "true") console.log('---------------------------------------------------------    Requête reçue    ------------------------------------------------------------------');
  //console.log("req => "+req);
  next();
});

/*app.get('/apiMetalKnight/form', csrfProtection, function (req, res, next) {
  if(process.env.DEVELOP === "true") console.log('Envoie du csrfToken');
  res.cookie("XSRF-TOKEN", req.csrfToken());
  res.send({csrfToken: req.csrfToken() });
  //console.log(res);
  next();
});*/

app.use('/apiMetalKnight/test', userTest);
//app.use('/apiMetalKnight/auth', userRoutes);//Pour s'enregistrer/vérification par mail et se logger
/*app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/stuff', stuffRoutes);
app.use('/api/studentBD', studentAPI);*/

app.use(function (req, res, next) {
  if(process.env.DEVELOP === "true") console.log('---------------------------------------------------------   Requête traitée   ------------------------------------------------------------------');
  //console.log("req => "+req);
  next();
});

module.exports = app;