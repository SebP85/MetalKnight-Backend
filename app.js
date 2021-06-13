const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');//Protège l'en-tête
const morgan = require('morgan');//affiche les log en console
const cors = require('cors');//Configure l'en-tête
const cookieParser = require('cookie-parser');
const config = require('./config/config');
const winston = require('./log/winston');//enregistre les logs dans un fichier
const { logger } = require('./log/winston');
const csrf = require("csurf");
if(process.env.DEVELOP === "false") logger.info('API '+process.env.NOM_APP+' Lancée');

const mongoSanitize = require('express-mongo-sanitize');//contre les attaques noSQL pour mongodb

const userRoutes = require('./routes/user');

const path = require('path');
const { strict } = require('assert');

mongoose.Promise = global.Promise;
mongoose.set("useCreateIndex", true);//ajout
mongoose.connect(config.db.database,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => {
    if(process.env.DEVELOP === "true") console.log('Connexion à MongoDB réussie !');
    if(process.env.DEVELOP === "false") logger.info('BDD OK');
  })
  .catch(() => {
    if(process.env.DEVELOP === "true") console.log('Connexion à MongoDB échouée !');
    if(process.env.DEVELOP === "false") logger.error('BDD NOK');
  });

const app = express();

app.use(helmet({
  frameguard: false // for SAMEORIGIN
}));
app.disable('x-powered-by');
app.use(morgan('dev', { stream: logger.stream.write }));

app.use(mongoSanitize());

var optionsCors = {
  origin: 'https://'+process.env.SITE_HOST+':'+process.env.SITE_PORT,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content', 'Accept', 'Content-Type', 'Authorization', 'x-xsrf-token', 'x-csrf-token', 'xsrftoken', 'refresh_token'],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  //maxAge: 3600,
};

app.use(cors(optionsCors));

app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
const csrfProtection = csrf({ cookie: {
  maxAge: config.token.refreshToken.expiresIn,
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
}});
var parseForm = express.urlencoded({
  extended: true
});
app.use(csrfProtection);
app.use(parseForm);

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


// Routes de l'API
app.use(function (req, res, next) {
  if(process.env.DEVELOP === "true") console.log('---------------------------------------------------------    Requête reçue    ------------------------------------------------------------------');
  if(process.env.DEVELOP === "false") {
    logger.info('Début requête');
    logger.info(`${req.method} - ${req.originalUrl} - ${req.ip}`);
  }
  next();
});

app.use(function (req, res, next) {
  if(process.env.DEVELOP === "true") console.log("body", req.body);

  next();
});

app.use('/api'+config.email.NOM_APP, userRoutes);

app.use(function (req, res, next) {
  if(process.env.DEVELOP === "true") console.log('---------------------------------------------------------   Requête traitée   ------------------------------------------------------------------');
  if(process.env.DEVELOP === "false") {
    logger.info('Fin requête');
    logger.info(`${req.method} - ${req.originalUrl} - ${req.ip}`);
  }
  next();
});

module.exports = app;