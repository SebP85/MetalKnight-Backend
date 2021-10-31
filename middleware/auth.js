const jwt = require('jsonwebtoken');
const { logger } = require('../log/winston');
const config = require('../config/config');
const RefreshToken = require('../models/RefreshToken');
const User = require('../models/User');
const moment = require('moment');
//const { findByIdAndDelete } = require('../models/RefreshToken');

const chatty = false;

exports.normal = (req, res, next) => {//Vérification des tokens
  try {
    if(process.env.DEVELOP === "true") console.log("début authentification");
    else logger.info("début fonction authentification")
    const { cookies, headers } = req;
    
    if (!cookies || !cookies.access_token) {//cookie présent ?
      if(process.env.DEVELOP === "true") {
        console.log('accessToken manquant');
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
        res.status(config.erreurServer.BAD_IDENTIFICATION).json({ message: 'Missing token in cookie' });
      } else {
        logger.error('accessToken manquant');
        res.status(config.erreurServer.BAD_IDENTIFICATION).json({ error: process.env.MSG_ERROR_PRODUCTION });
      }
      next(false);
    }
    const accessToken = cookies.access_token;

    if (!headers || !headers['xsrftoken']) {
      if(process.env.DEVELOP === "true") {
        console.log('xsrfToken manquant');
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
        res.status(config.erreurServer.BAD_IDENTIFICATION).json({ message: 'Missing XSRF token in headers' });
      } else {
        logger.error('xsrfToken manquant');
        res.status(config.erreurServer.BAD_IDENTIFICATION).json({ error: process.env.MSG_ERROR_PRODUCTION });
      }
      next(false);
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
          console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
          res.status(config.erreurServer.BAD_IDENTIFICATION).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/expired");//page de connexion
        } else {
          logger.error('refreshToken introuvable dans la BDD');
          res.status(config.erreurServer.BAD_IDENTIFICATION).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/expired");//page de connexion
        }
        next(false);
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
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
            res.status(config.erreurServer.BAD_IDENTIFICATION).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");//page de connexion
          } else {
            logger.error('date expiration cookie incohérent');
            res.status(config.erreurServer.BAD_IDENTIFICATION).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");//page de connexion
          }
          next(false);
        }

        if(process.env.DEVELOP === "true") console.log('Expiration cookie identique');
        else logger.info('Expiration cookie identique');

        if(process.env.DEVELOP === "true") {
          console.log('xsrfToken', xsrfToken);
          console.log('decodedToken.xsrfToken', decodedToken.xsrfToken);    
        }

        if (xsrfToken !== decodedToken.xsrfToken) {//si les tokens ne correspondent pas, on sort
          if(process.env.DEVELOP === "true") {
            console.log('xsrfToken ne correspond pas (normal)');
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
            res.status(config.erreurServer.BAD_IDENTIFICATION).json({ message: 'Bad xsrf token' });
          } else {
            logger.error('xsrfToken ne correspond pas (normal)');
            res.status(config.erreurServer.BAD_IDENTIFICATION).json({ error: process.env.MSG_ERROR_PRODUCTION });
          }
          next(false);
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
              res.status(config.erreurServer.ERREUR_SERVER).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");
            } else {
              logger.error("Pb BDD User");
              res.status(config.erreurServer.ERREUR_SERVER).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");
            }
            next(false);
          });
      }
    })
    .catch(error => {
      if(process.env.DEVELOP === "true") {  
        console.log(error, error);      
        console.log("Pb BDD refreshToken");
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        res.status(config.erreurServer.ERREUR_SERVER).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");
      } else {
        logger.error("Pb BDD refreshToken");
        res.status(config.erreurServer.ERREUR_SERVER).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");
      }
      next(false);
    });

    

  } catch {
    if(process.env.DEVELOP === "true") console.log("erreur authentification !")
    if(process.env.DEVELOP === "true")
      res.status(config.erreurServer.BAD_IDENTIFICATION).json({error: new Error('Invalid request!')});
    else
      res.status(config.erreurServer.BAD_IDENTIFICATION).json({error: new Error(process.env.MSG_ERROR_PRODUCTION)});
    
    next(false);
  }
};

exports.refreshToken = function (req, res, next){//MAJ refreshToken, accessToken et xsrfToken
  try {
    if(process.env.DEVELOP === "true") console.log("début authentification refreshToken");
    else logger.info("début fonction authentification refreshToken")
    const { headers, cookies } = req;

    /*if (!cookies || !cookies.access_token) {//cookie présent ?
      if(process.env.DEVELOP === "true") {
        console.log('accessToken manquant');
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
        return res.status(config.erreurServer.ACCESS_REFUSED).json({ message: 'Missing token in cookie' });
      } else {
        logger.error('accessToken manquant');
        return res.status(config.erreurServer.ACCESS_REFUSED).json({ error: process.env.MSG_ERROR_PRODUCTION });
      }
      
    }
    const accessToken = cookies.access_token;*/
    
    if (!cookies || !cookies.refresh_token) {//cookie présent ?
      if(process.env.DEVELOP === "true") {
        console.log('refreshToken manquant');
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
        res.status(config.erreurServer.ACCESS_REFUSED).json({ message: 'Missing token in cookie' });
      } else {
        logger.error('refreshToken manquant');
        res.status(config.erreurServer.ACCESS_REFUSED).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");//page de connexion
      }
      next(false);
    }
    const refreshToken = cookies.refresh_token;

    if (!headers || !headers['xsrftoken']) {
      if(process.env.DEVELOP === "true") {
        console.log('xsrfToken manquant');
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
        res.status(config.erreurServer.ACCESS_REFUSED).json({ message: 'Missing XSRF token in headers' });
      } else {
        logger.error('xsrfToken manquant');
        res.status(config.erreurServer.ACCESS_REFUSED).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");//page de connexion
      }
      next(false);
    }
    const xsrfToken = headers['xsrftoken'];

    //Vérification du accessToken
    /*const decodedAccessToken = jwt.verify(accessToken, config.token.accessToken.secret, {
      algorithms: config.token.accessToken.algorithm
    });
    if(process.env.DEVELOP === "true") console.log('decodedAccessToken', decodedAccessToken);

    if(process.env.DEVELOP === "true") {
      console.log('xsrfToken', xsrfToken);
      console.log('decodedAccessToken.xsrfToken', decodedAccessToken.xsrfToken);    
    }*/

    /*if (xsrfToken !== decodedAccessToken.xsrfToken) {//si les tokens ne correspondent pas, on sort
      if(process.env.DEVELOP === "true") {
        console.log('xsrfToken ne correspond pas');
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
        res.status(config.erreurServer.ACCESS_REFUSED).json({ message: 'Bad xsrf token' });
      } else {
        logger.error('xsrfToken ne correspond pas');
        res.status(config.erreurServer.ACCESS_REFUSED).json({ error: process.env.MSG_ERROR_PRODUCTION });
      }
      next(false);
    }*/

    const decodedToken = jwt.verify(refreshToken, config.token.refreshToken.secret, {
      algorithms: config.token.refreshToken.algorithm
    });
    if(process.env.DEVELOP === "true") console.log('decodedToken', decodedToken);

    //Recherche du refreshToken dans la BDD
    RefreshToken.findOne({ userId: decodedToken.sub })
    .then((result) => {//Pas de problème avec la BDD
      if(!result) {//user et refreshToken n'existent pas dans la BDD
        if(process.env.DEVELOP === "true") {
          console.log('refreshToken introuvable dans la BDD');
          console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
          res.status(config.erreurServer.ACCESS_REFUSED);//page de connexion
        } else {
          logger.error('refreshToken introuvable dans la BDD');
          res.status(config.erreurServer.ACCESS_REFUSED);//page de connexion
        }
        next(false);
      } else {//user et refreshToken existent dans la BDD
        //On compare le refreshToken dans la BDD à celui dans la requête
        if(process.env.DEVELOP === "true") console.log('result', result);
        if (result.refreshToken !== decodedToken.refToken) {//si les tokens ne correspondent pas, on sort
          if(process.env.DEVELOP === "true") {
            console.log('refToken ne correspond pas');
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
            res.status(config.erreurServer.ACCESS_REFUSED).json({ message: 'Bad refToken' });
          } else {
            logger.error('refToken ne correspond pas');
            res.status(config.erreurServer.ACCESS_REFUSED).json({ error: process.env.MSG_ERROR_PRODUCTION });
          }
          next(false);
        }
        
        if(process.env.DEVELOP === "true") console.log('refToken identique');
        else logger.info('refToken identique');

        if(process.env.DEVELOP === "true") console.log("Date d'expiration refreshToken", moment(result.expiresAt));
        var dateExpireRefreshTokenTheorique = new Date(result.expiresAt + config.token.refreshToken.expiresIn);
        if(moment(dateExpireRefreshTokenTheorique).isAfter(Date.now())){
          if(process.env.DEVELOP === "true") console.log("Date d'expiration ok");
          else logger.info("Date d'expiration ok");
        } else {
          if(process.env.DEVELOP === "true") {
            console.log("Date d'expiration nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------'); 
          } else logger.info("Date d'expiration nok");

          res.status(config.erreurServer.ACCESS_REFUSED).json({ message: "Date d'expiration nok" });
          next(false);
        }

        if(process.env.DEVELOP === "true") {
          console.log('xsrfToken', xsrfToken); 
        }

        if (xsrfToken !== decodedToken.xsrfToken) {//si les tokens ne correspondent pas, on sort
          if(process.env.DEVELOP === "true") {
            console.log('xsrfToken ne correspond pas (refreshToken)');
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
            res.status(config.erreurServer.ACCESS_REFUSED).json({ message: 'Bad xsrf token' });
          } else {
            logger.error('xsrfToken ne correspond pas (refreshToken)');
            res.status(config.erreurServer.ACCESS_REFUSED).json({ error: process.env.MSG_ERROR_PRODUCTION });
          }
          next(false);
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
            req.user = result;
            next();
          })
          .catch(error => {
            if(process.env.DEVELOP === "true") {  
              console.log(error, error);      
              console.log("Pb BDD User");
              console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
              res.status(config.erreurServer.ERREUR_SERVER);
            } else {
              logger.error("Pb BDD User");
              res.status(config.erreurServer.ERREUR_SERVER);
            }
            next(false);
          });
      }
    })
    .catch(error => {
      if(process.env.DEVELOP === "true") {  
        console.log(error, error);      
        console.log("Pb BDD refreshToken");
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        res.status(config.erreurServer.ERREUR_SERVER);
      } else {
        logger.error("Pb BDD refreshToken");
        res.status(config.erreurServer.ERREUR_SERVER);
      }
      next(false);
    });

    

  } catch(err) {
    if(process.env.DEVELOP === "true" || chatty) {
      console.log("erreur authentification !")
      console.log("---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------")
      res.status(config.erreurServer.ACCESS_REFUSED).json({error: new Error('Invalid request!')});
      
    } else {
      logger.error("erreur authentification !", err);
      res.status(config.erreurServer.ACCESS_REFUSED).json({error: new Error(process.env.MSG_ERROR_PRODUCTION)});
    }
    next(false);
  }
};

exports.mailNewPassword = function (req, res, next){//Vérification refreshToken, accessToken et xsrfToken
  try{
    if(process.env.DEVELOP === "true") console.log("début authentification refreshToken");
    else logger.info("début fonction authentification refreshToken")
    const { cookies, headers } = req;

    if (!cookies || !cookies.access_token) {//cookie présent ?
      if(process.env.DEVELOP === "true") {
        console.log('accessToken manquant');
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
        res.status(config.erreurServer.BAD_IDENTIFICATION).json({ message: 'Missing token in cookie' });
      } else {
        logger.error('accessToken manquant');
        res.status(config.erreurServer.BAD_IDENTIFICATION).json({ error: process.env.MSG_ERROR_PRODUCTION });
      }
      next(false);
    }
    const accessToken = cookies.access_token;
    
    if (!cookies || !cookies.refresh_token) {//cookie présent ?
      if(process.env.DEVELOP === "true") {
        console.log('refreshToken manquant');
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
        res.status(config.erreurServer.BAD_IDENTIFICATION).json({ message: 'Missing token in cookie' });
      } else {
        logger.error('refreshToken manquant');
        res.status(config.erreurServer.BAD_IDENTIFICATION).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");//page de connexion
      }
      next(false);
    }
    const refreshToken = cookies.refresh_token;

    if (!headers || !headers['xsrftoken']) {
      if(process.env.DEVELOP === "true") {
        console.log('xsrfToken manquant');
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
        res.status(config.erreurServer.BAD_IDENTIFICATION).json({ message: 'Missing XSRF token in headers' });
      } else {
        logger.error('xsrfToken manquant');
        res.status(config.erreurServer.BAD_IDENTIFICATION).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");//page de connexion
      }
      next(false);
    }
    const xsrfToken = headers['xsrftoken'];

    const decodedAccessToken = jwt.verify(accessToken, config.token.accessToken.secret, {
      algorithms: config.token.accessToken.algorithm
    });
    if(process.env.DEVELOP === "true") console.log('decodedAccessToken', decodedAccessToken);

    const decodedRefreshToken = jwt.verify(refreshToken, config.token.refreshToken.secret, {
      algorithms: config.token.refreshToken.algorithm
    });
    if(process.env.DEVELOP === "true") console.log('decodedRefreshToken', decodedRefreshToken);

    //On vérifie les données décodées qui doivent être identique
    //xsrfToken
    if((decodedAccessToken.xsrfToken !== decodedRefreshToken.xsrfToken) && (decodedAccessToken.xsrfToken !== xsrfToken)){
      if(process.env.DEVELOP === "true") {
        console.log('xsrfToken different');
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
        res.status(config.erreurServer.BAD_IDENTIFICATION).json({ message: 'xsrfToken different' });
      } else {
        logger.error('xsrfToken different');
        res.status(config.erreurServer.BAD_IDENTIFICATION).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");//page de connexion
      }
      next(false);
    }

    //refToken
    if((decodedAccessToken.firstName !== decodedRefreshToken.firstName) && (decodedAccessToken.lastName !== decodedRefreshToken.lastName) &&
      (decodedAccessToken.aud !== decodedRefreshToken.aud) && (decodedAccessToken.sub !== decodedRefreshToken.sub)){
      if(process.env.DEVELOP === "true") {
        console.log('Token different');
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
        res.status(config.erreurServer.BAD_IDENTIFICATION).json({ message: 'Token different' });
      } else {
        logger.error('Token different');
        res.status(config.erreurServer.BAD_IDENTIFICATION).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");//page de connexion
      }
      next(false);
    }

    //Token expiré
    if(process.env.DEVELOP === "true") {
      console.log("Date d'expiration accessToken aud", moment(Number(decodedAccessToken.aud)));
      console.log("Diff exp - iat", decodedAccessToken.exp - decodedAccessToken.iat);

      console.log("---------------------------------------------------------------");

      console.log("Date d'expiration refreshToken aud", moment(Number(decodedRefreshToken.aud)));
      console.log("Diff exp - iat", decodedRefreshToken.exp - decodedRefreshToken.iat);

      console.log("---------------------------------------------------------------");
    }

    if(process.env.DEVELOP === "true") console.log("Date d'expiration accessToken", moment(new Date(Number(decodedAccessToken.aud)+ config.token.accessToken.expiresIn)));
    
    if(process.env.DEVELOP === "true") {
      console.log("Valeur expireIn accessToken", decodedAccessToken.exp - decodedAccessToken.iat);
      console.log("Valeur expireIn refreshToken", decodedRefreshToken.exp - decodedRefreshToken.iat);
    }
    
    //vérification delai expireIn
    if(((decodedAccessToken.exp - decodedAccessToken.iat) !== config.token.accessToken.expiresIn) || ((decodedRefreshToken.exp - decodedRefreshToken.iat) !== config.token.refreshToken.expiresIn)){
      if(process.env.DEVELOP === "true") {
        console.log('Token delai expireIn différent');
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
        res.status(config.erreurServer.BAD_IDENTIFICATION).json({ message: 'Token delai expireIn différent' });
      } else {
        logger.error('Token delai expireIn différent');
        res.status(config.erreurServer.BAD_IDENTIFICATION).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");//page de connexion
      }
      next(false);
    }
    if(process.env.DEVELOP === "true") console.log("vérification delai expireIn ok");

    //cookie expiré ?
    if(moment().isAfter(moment(new Date(Number(decodedAccessToken.aud)+ config.token.accessToken.expiresIn)))){
      if(process.env.DEVELOP === "true") {
        console.log('Token expiré');
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
        res.status(config.erreurServer.BAD_IDENTIFICATION).json({ message: 'Token expiré' });
      } else {
        logger.error('Token expiré');
        res.status(config.erreurServer.BAD_IDENTIFICATION).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");//page de connexion
      }
      next(false);
    }
    if(process.env.DEVELOP === "true") console.log("cookie expiré ok");

    //Recherche du user dans la BDD Users
    User.findOne({ _id: decodedAccessToken.sub })
    .then((result) => {//Pas de problème avec la BDD
      if(!result) {//user n'existent pas dans la BDD
        if(process.env.DEVELOP === "true") {
          console.log('user introuvable dans la BDD');
          console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
          res.status(config.erreurServer.BAD_IDENTIFICATION).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");//page de connexion
        } else {
          logger.error('user introuvable dans la BDD');
          res.status(config.erreurServer.BAD_IDENTIFICATION).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");//page de connexion
        }
        next(false);
      } else {

        //verif token dans la bdd Users
        if(result.token !== decodedAccessToken.xsrfToken){
          if(process.env.DEVELOP === "true") {
            console.log('Token non trouvé dans la BDD Users');
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
            res.status(config.erreurServer.BAD_IDENTIFICATION).json({ message: 'Token non trouvé dans la BDD Users' });
          } else {
            logger.error('Token non trouvé dans la BDD Users');
            res.status(config.erreurServer.BAD_IDENTIFICATION).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");//page de connexion
          }
          next(false);
        }

        //verif refreshToken dans la bdd Users
        if(result.refreshToken !== decodedRefreshToken.refToken){
          if(process.env.DEVELOP === "true") {
            console.log('refreshToken non trouvé dans la BDD Users');
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
            res.status(config.erreurServer.BAD_IDENTIFICATION).json({ message: 'refreshToken non trouvé dans la BDD Users' });
          } else {
            logger.error('refreshToken non trouvé dans la BDD Users');
            res.status(config.erreurServer.BAD_IDENTIFICATION).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");//page de connexion
          }
          next(false);
        }

        //ajout de l'email dans le body de la requête
        req.body.email = result.email;

        next();
      }
    })
    .catch(error => {
      if(process.env.DEVELOP === "true") {  
        console.log(error, error);      
        console.log("Pb BDD Users");
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        res.status(config.erreurServer.ERREUR_SERVER).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");
      } else {
        logger.error("Pb BDD Users");
        res.status(config.erreurServer.ERREUR_SERVER).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");
      }
      next(false);
    });

  }catch(err){
    if(process.env.DEVELOP === "true") {
      console.log("erreur authentification !")
      console.log("---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------")
      res.status(config.erreurServer.BAD_IDENTIFICATION).json({error: new Error('Invalid request!')});
      
    } else {
      logger.error("erreur authentification !", err);
      res.status(config.erreurServer.BAD_IDENTIFICATION).json({error: new Error(process.env.MSG_ERROR_PRODUCTION)});
    }
    next(false);
  }
}