const User = require('../models/User');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const { logger } = require('../log/winston');

exports.levelAuthorizeFree = (req, res, next) => {//Role autorisé Free
    if(process.env.DEVELOP === "true") console.log("fonction levelAuthorizeFree !");
    else logger.info("Requête levelAuthorizeFree lancée !");

    const { cookies } = req;
    
    if (!cookies || !cookies.access_token) {//cookie présent ?
      if(process.env.DEVELOP === "true") {
        console.log('accessToken manquant');
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
        res.status(config.erreurServer.BAD_REQUEST).json({ message: 'Missing token in cookie' });
      } else {
        logger.error('accessToken manquant');
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
      }
      next(false);
    }
    const accessToken = cookies.access_token;

    const decodedToken = jwt.verify(accessToken, config.token.accessToken.secret, {
        algorithms: config.token.accessToken.algorithm
      });
    if(process.env.DEVELOP === "true") console.log('decodedToken', decodedToken);

    //Recherche du refreshToken dans la BDD
    User.findOne({ _id: decodedToken.sub })
    .then((result) => {//Pas de problème avec la BDD
      if(!result) {
        if(process.env.DEVELOP === "true") {
            console.log('user introuvable dans la BDD');
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
            res.status(config.erreurServer.BAD_REQUEST).redirect("http://localhost:8080/login");//page de connexion
        } else {
            logger.error('user introuvable dans la BDD');
            res.status(config.erreurServer.BAD_REQUEST).redirect("http://localhost:8080/login");//page de connexion
        }
        next(false);
      } else {
          if((result.role === config.role.roleFree) || (result.role === config.role.roleAmateur) ||
            (result.role === config.role.roleExpert) || (result.role === config.role.roleAdmin)){
            req.body.role = result.role;
            next();
          } else {
            if(process.env.DEVELOP === "true") {
                console.log('droit du role interdit');
                console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
                res.status(config.erreurServer.BAD_REQUEST);
            } else {
                logger.error('droit du role interdit');
                res.status(config.erreurServer.BAD_REQUEST);
            }
            next(false);
          }
      }
    })
    .catch(error => {
        if(process.env.DEVELOP === "true") {  
            console.log(error, error);      
            console.log("Pb BDD Users");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
            res.status(config.erreurServer.ERREUR_SERVER).redirect("http://localhost:8080/login");
        } else {
            logger.error("Pb BDD Users");
            res.status(config.erreurServer.ERREUR_SERVER).redirect("http://localhost:8080/login");
        }
        next(false);
    });

};

exports.levelAuthorizeAmateur = (req, res, next) => {//Role autorisé Amateur
    if(process.env.DEVELOP === "true") console.log("fonction levelAuthorizeAmateur !");
    else logger.info("Requête levelAuthorizeAmateur lancée !");

    if(process.env.DEVELOP === "true") console.log("fonction levelAuthorizeFree !");
    else logger.info("Requête levelAuthorizeFree lancée !");

    const { cookies } = req;
    
    if (!cookies || !cookies.access_token) {//cookie présent ?
      if(process.env.DEVELOP === "true") {
        console.log('accessToken manquant');
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
        res.status(config.erreurServer.BAD_REQUEST).json({ message: 'Missing token in cookie' });
      } else {
        logger.error('accessToken manquant');
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
      }
      next(false);
    }
    const accessToken = cookies.access_token;

    const decodedToken = jwt.verify(accessToken, config.token.accessToken.secret, {
        algorithms: config.token.accessToken.algorithm
      });
    if(process.env.DEVELOP === "true") console.log('decodedToken', decodedToken);

    //Recherche du refreshToken dans la BDD
    User.findOne({ _id: decodedToken.sub })
    .then((result) => {//Pas de problème avec la BDD
      if(!result) {
        if(process.env.DEVELOP === "true") {
            console.log('user introuvable dans la BDD');
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
            res.status(config.erreurServer.BAD_REQUEST).redirect("http://localhost:8080/login");//page de connexion
        } else {
            logger.error('user introuvable dans la BDD');
            res.status(config.erreurServer.BAD_REQUEST).redirect("http://localhost:8080/login");//page de connexion
        }
        next(false);
      } else {
          if((result.role === config.role.roleAmateur) ||
            (result.role === config.role.roleExpert) || (result.role === config.role.roleAdmin)){
            req.body.role = result.role;
            next();
          } else {
            if(process.env.DEVELOP === "true") {
                console.log('droit du role interdit');
                console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
                res.status(config.erreurServer.BAD_REQUEST);
            } else {
                logger.error('droit du role interdit');
                res.status(config.erreurServer.BAD_REQUEST);
            }
            next(false);
          }
      }
    })
    .catch(error => {
        if(process.env.DEVELOP === "true") {  
            console.log(error, error);      
            console.log("Pb BDD Users");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
            res.status(config.erreurServer.ERREUR_SERVER);
        } else {
            logger.error("Pb BDD Users");
            res.status(config.erreurServer.ERREUR_SERVER);
        }
        next(false);
    });

};

exports.levelAuthorizeExpert = (req, res, next) => {//Role autorisé Expert
    if(process.env.DEVELOP === "true") console.log("fonction levelAuthorizeExpert !");
    else logger.info("Requête levelAuthorizeExpert lancée !");

    if(process.env.DEVELOP === "true") console.log("fonction levelAuthorizeFree !");
    else logger.info("Requête levelAuthorizeFree lancée !");

    const { cookies } = req;
    
    if (!cookies || !cookies.access_token) {//cookie présent ?
      if(process.env.DEVELOP === "true") {
        console.log('accessToken manquant');
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
        res.status(config.erreurServer.BAD_REQUEST).json({ message: 'Missing token in cookie' });
      } else {
        logger.error('accessToken manquant');
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
      }
      next(false);
    }
    const accessToken = cookies.access_token;

    const decodedToken = jwt.verify(accessToken, config.token.accessToken.secret, {
        algorithms: config.token.accessToken.algorithm
      });
    if(process.env.DEVELOP === "true") console.log('decodedToken', decodedToken);

    //Recherche du refreshToken dans la BDD
    User.findOne({ _id: decodedToken.sub })
    .then((result) => {//Pas de problème avec la BDD
      if(!result) {
        if(process.env.DEVELOP === "true") {
            console.log('user introuvable dans la BDD');
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
            res.status(config.erreurServer.BAD_REQUEST);
        } else {
            logger.error('user introuvable dans la BDD');
            res.status(config.erreurServer.BAD_REQUEST);
        }
        next(false);
      } else {
          if((result.role === config.role.roleExpert) || (result.role === config.role.roleAdmin)){
            req.body.role = result.role;
            next();
          } else {
            if(process.env.DEVELOP === "true") {
                console.log('droit du role interdit');
                console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
                res.status(config.erreurServer.BAD_REQUEST);
            } else {
                logger.error('droit du role interdit');
                res.status(config.erreurServer.BAD_REQUEST);
            }
            next(false);
          }
      }
    })
    .catch(error => {
        if(process.env.DEVELOP === "true") {  
            console.log(error, error);      
            console.log("Pb BDD Users");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
            res.status(config.erreurServer.ERREUR_SERVER);
        } else {
            logger.error("Pb BDD Users");
            res.status(config.erreurServer.ERREUR_SERVER);
        }
        next(false);
    });
};

exports.levelAuthorizeAdmin = (req, res, next) => {//Role autorisé Admin
    if(process.env.DEVELOP === "true") console.log("fonction levelAuthorizeAdmin !");
    else logger.info("Requête levelAuthorizeAdmin lancée !");

    if(process.env.DEVELOP === "true") console.log("fonction levelAuthorizeFree !");
    else logger.info("Requête levelAuthorizeFree lancée !");

    const { cookies } = req;
    
    if (!cookies || !cookies.access_token) {//cookie présent ?
      if(process.env.DEVELOP === "true") {
        console.log('accessToken manquant');
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
        res.status(config.erreurServer.BAD_REQUEST).json({ message: 'Missing token in cookie' });
      } else {
        logger.error('accessToken manquant');
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
      }
      next(false);
    }
    const accessToken = cookies.access_token;

    const decodedToken = jwt.verify(accessToken, config.token.accessToken.secret, {
        algorithms: config.token.accessToken.algorithm
      });
    if(process.env.DEVELOP === "true") console.log('decodedToken', decodedToken);

    //Recherche du refreshToken dans la BDD
    User.findOne({ _id: decodedToken.sub })
    .then((result) => {//Pas de problème avec la BDD
      if(!result) {
        if(process.env.DEVELOP === "true") {
            console.log('user introuvable dans la BDD');
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
            res.status(config.erreurServer.BAD_REQUEST);
        } else {
            logger.error('user introuvable dans la BDD');
            res.status(config.erreurServer.BAD_REQUEST);
        }
        next(false);
      } else {
        if((result.role === config.role.roleAdmin)){
          req.body.role = result.role;
          next();
        } else {
          if(process.env.DEVELOP === "true") {
              console.log('droit du role interdit');
              console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
              res.status(config.erreurServer.BAD_REQUEST);
          } else {
              logger.error('droit du role interdit');
              res.status(config.erreurServer.BAD_REQUEST);
          }
          next(false);
        }
      }
    })
    .catch(error => {
        if(process.env.DEVELOP === "true") {
            console.log(error, error);      
            console.log("Pb BDD Users");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
            res.status(config.erreurServer.ERREUR_SERVER).redirect("http://localhost:8080/login");
        } else {
            logger.error("Pb BDD Users");
            res.status(config.erreurServer.ERREUR_SERVER).redirect("http://localhost:8080/login");
        }
        next(false);
    });
};