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
const noCache = require('nocache');
const Annonce = require('./models/Annonce');
const moment = require('moment');
const fs = require('fs');

if(process.env.DEVELOP === "false") logger.info('API '+process.env.NOM_APP+' Lancée');

const mongoSanitize = require('express-mongo-sanitize');//contre les attaques noSQL pour mongodb

const userRoutes = require('./routes/user');

const path = require('path');
const { strict } = require('assert');

var chatty = false;

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

app.use(helmet());
app.use(noCache());
app.disable("x-powered-by")
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
csrfProtection = csrf({ cookie:  {
  //maxAge: config.token.refreshToken.expiresIn,
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
}})
var parseForm = express.urlencoded({
  extended: true
});
app.use(csrfProtection);
app.set('csrfProtection', csrfProtection);
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

app.use('/Images/Avatar', express.static(path.join(__dirname, 'Images/Avatar')));//accès au dossiers images

app.use('/api'+config.email.NOM_APP, userRoutes);

app.use(function (req, res, next) {
  if(process.env.DEVELOP === "true") console.log('---------------------------------------------------------   Requête traitée   ------------------------------------------------------------------');
  if(process.env.DEVELOP === "false") {
    logger.info('Fin requête');
    logger.info(`${req.method} - ${req.originalUrl} - ${req.ip}`);
  }
  next();
});

function refreshBDD() {
  if(chatty) console.log('fonction refreshBDD');
  //On supprime les annonces qui n'ont pas été validé depuis 3 jours

  Annonce.find({ annonceValide: false })
    .then((annonces) => {//Pas de problème avec la BDD
      if(chatty) console.log("annonceValide false trouvé")
      
      if(annonces.length > 0) {//Si on a des annonces Valide = false
        if(chatty) {
          console.log(annonces)

          console.log("m=", moment().toDate())
          console.log("datePoster +3j", moment(annonces[0].datePoster).add(3, 'd'))
          console.log(moment(moment().toDate()).isAfter(moment(annonces[0].datePoster).add(3, 'd')))
        }

        for (const annonce of annonces) {
          if(moment(moment().toDate()).isAfter(moment(annonce.datePoster).add(3, 'd'))){
            if(chatty) {
              console.log("1 annonce à supprimer")
              console.log("Photos de l'annonce supprimées")
            }

            for (const photo of annonce.photos) {
              /*fs.unlink(`Images/Annnonces/${photo.split('/Images/Avatar/')[1]}`, () => {
                coloc.avatar="";
        
                Coloc.updateOne({ userId: decodedToken.sub }, coloc)
                  .then(() => {//sauvegarde faite
                    if(process.env.DEVELOP === "true") console.log("updateOne ok");
                    next();
                  })
                  .catch(error => {//pb avec la bdd coloc
                    if(process.env.DEVELOP === "true") {
                      console.log('erreur pour enregistrer le coloc updateOne');
                      console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
                      res.status(400).json({ error });
                    } else {
                      logger.error("Erreur MongoDB pour enregistrer coloc updateOne");
                      console.log(process.env.MSG_ERROR_PRODUCTION);
                      res.status(400).json({ message: process.env.MSG_ERROR_PRODUCTION });
                    }
                  });
              });*/
            }

            Annonce.deleteOne({ _id: annonce._id })
              .then(() => {
                if(chatty) console.log("1 annonce supprimé")
              })
              .catch(error => {//Pb avec la BDD
                if(process.env.DEVELOP === "true") {
                  console.log("Erreur pour supprimer 1 annonce");
                } else {
                  logger.error("Erreur MongoDB pour supprimer 1 annonce");
                }
              });
          }
        }
      }
    })
    .catch(error => {//Pb avec la BDD
      if(process.env.DEVELOP === "true") {
        console.log("Erreur pour vérifier les annonces non valide");
      } else {
        logger.error("Erreur MongoDB pour vérifier les annonces non valide");
      }
    });
    
}

setInterval(refreshBDD, 86400000);//86400000=24h

module.exports = app;