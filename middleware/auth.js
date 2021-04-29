const jwt = require('jsonwebtoken');
const { logger } = require('../log/winston');
const config = require('../config/config');
const RefreshToken = require('../models/RefreshToken');
const User = require('../models/User');
const moment = require('moment');

module.exports = (req, res, next) => {//Vérification des tokens
  try {
    if(process.env.DEVELOP === "true") console.log("début authentification");
    else logger.info("début fonction authentification")
    const { cookies, headers } = req;
    
    if (!cookies || !cookies.access_token) {//cookie présent ?
      if(process.env.DEVELOP === "true") {
        console.log('accessToken manquant');
        console.log('---------------------------------------------------------   Requête traitée   ------------------------------------------------------------------');    
        return res.status(401).json({ message: 'Missing token in cookie' });
      } else {
        logger.error('accessToken manquant');
        return res.status(401).json({ error: process.env.MSG_ERROR_PRODUCTION });
      }
      
    }
    const accessToken = cookies.access_token;

    if (!headers || !headers['xsrftoken']) {
      if(process.env.DEVELOP === "true") {
        console.log('xsrfToken manquant');
        console.log('---------------------------------------------------------   Requête traitée   ------------------------------------------------------------------');    
        return res.status(401).json({ message: 'Missing XSRF token in headers' });
      } else {
        logger.error('xsrfToken manquant');
        return res.status(401).json({ error: process.env.MSG_ERROR_PRODUCTION });
      }
    }
    const xsrfToken = headers['xsrftoken'];

    const decodedToken = jwt.verify(accessToken, config.token.accessToken.secret, {
      algorithms: config.token.accessToken.algorithm
    });
    if(process.env.DEVELOP === "true") console.log('decodedToken', decodedToken);

    //Recherche du refreshToken dans la BDD
    RefreshToken.findOne({ userId: decodedToken.sub })
    .then((result) => {//Pas de problème avec la BDD
      if(!result) {//user et refreshToken n'existent pas dans la BDD
        if(process.env.DEVELOP === "true") {
          console.log('refreshToken introuvable dans la BDD');
          console.log('---------------------------------------------------------   Requête traitée   ------------------------------------------------------------------');    
          return res.status(401).redirect("http://localhost:8080/login");//page de connexion
        } else {
          logger.error('refreshToken introuvable dans la BDD');
          return res.status(401).redirect("http://localhost:8080/login");//page de connexion
        }
      } else {//user et refreshToken existent dans la BDD
        if(process.env.DEVELOP === "true") console.log("Date d'expiration refreshToken", moment(result.expiresAt));
        var dateExpireAccessTokenTheorique = new Date(result.expiresAt - config.token.refreshToken.expiresIn + config.token.accessToken.expiresIn);
        if(process.env.DEVELOP === "true") {
          console.log("Date d'expiration accessToken théorique", moment(dateExpireAccessTokenTheorique));
          console.log("Date d'expiration accessToken réel", moment(new Date(Number(decodedToken.aud) + decodedToken.exp - decodedToken.iat)));
        }

        if(moment(dateExpireAccessTokenTheorique).isSame(moment(new Date(Number(decodedToken.aud) + decodedToken.exp - decodedToken.iat)))) {//date accessToken th et réel identique
          //on sort car les dates ne correspondent pas
          if(process.env.DEVELOP === "true") {
            console.log('date expiration cookie incohérent');
            console.log('---------------------------------------------------------   Requête traitée   ------------------------------------------------------------------');    
            return res.status(401).redirect("http://localhost:8080/login");//page de connexion
          } else {
            logger.error('date expiration cookie incohérent');
            return res.status(401).redirect("http://localhost:8080/login");//page de connexion
          }
        }

        if(process.env.DEVELOP === "true") console.log('Expiration cookie identique');
        else logger.info('Expiration cookie identique');

        if(process.env.DEVELOP === "true") {
          console.log('xsrfToken', xsrfToken);
          console.log('decodedToken.xsrfToken', decodedToken.xsrfToken);    
        }

        if (xsrfToken !== decodedToken.xsrfToken) {//si les tokens ne correspondent pas, on sort
          if(process.env.DEVELOP === "true") {
            console.log('xsrfToken ne correspond pas');
            console.log('---------------------------------------------------------   Requête traitée   ------------------------------------------------------------------');    
            return res.status(401).json({ message: 'Bad xsrf token' });
          } else {
            logger.error('xsrfToken ne correspond pas');
            return res.status(401).json({ error: process.env.MSG_ERROR_PRODUCTION });
          }
        }
        
        if(process.env.DEVELOP === "true") console.log('xsrfToken identique');
        else logger.info('xsrfToken identique');

        //On vérifie la présence de l'utilisateur dans la base de données
        const userId = decodedToken.sub;

        User.findOne({ _id: userId })
          .then((result) => {
            if(process.env.DEVELOP === "true") console.log('user authentifié');
            else logger.info("user authentifié")

            //On enregistre le nom de l'utilisateur dans la req
            req.user = result._id;
            next();
          })
          .catch(error => {
            if(process.env.DEVELOP === "true") {  
              console.log(error, error);      
              console.log("Pb BDD User");
              console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
              res.status(500).redirect("http://localhost:8080/login");
            } else {
              logger.error("Pb BDD User");
              res.status(500).redirect("http://localhost:8080/login");
            }
          });
      }
    })
    .catch(error => {
      if(process.env.DEVELOP === "true") {  
        console.log(error, error);      
        console.log("Pb BDD refreshToken");
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        res.status(500).redirect("http://localhost:8080/login");
      } else {
        logger.error("Pb BDD refreshToken");
        res.status(500).redirect("http://localhost:8080/login");
      }
    });

    

  } catch {
    if(process.env.DEVELOP === "true") console.log("erreur authentification !")
    if(process.env.DEVELOP === "true")
      res.status(401).json({
        error: new Error('Invalid request!')
        
      });
    else
      res.status(401).json({
        error: new Error(process.env.MSG_ERROR_PRODUCTION)
        
      });
  }
};