const User = require('../models/User');
const config = require('../config/config');
const jwt = require('jsonwebtoken');

exports.levelAuthorizeFree = (req, res, next) => {//Role autorisé Free
    if(process.env.DEVELOP === "true") console.log("fonction levelAuthorizeFree !");
    else logger.info("Requête levelAuthorizeFree lancée !");

    const { cookies } = req;
    
    if (!cookies || !cookies.access_token) {//cookie présent ?
      if(process.env.DEVELOP === "true") {
        console.log('accessToken manquant');
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
        return res.status(401).json({ message: 'Missing token in cookie' });
      } else {
        logger.error('accessToken manquant');
        return res.status(401).json({ error: process.env.MSG_ERROR_PRODUCTION });
      }
      
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
            return res.status(401).redirect("http://localhost:8080/login");//page de connexion
        } else {
            logger.error('user introuvable dans la BDD');
            return res.status(401).redirect("http://localhost:8080/login");//page de connexion
        }
      } else {
          if((result.role === config.role.roleFree) || (result.role === config.role.roleAmateur) ||
            (result.role === config.role.roleExpert) || (result.role === config.role.roleAdmin)){
            req.body.role = result.role;
            next();
          } else {
            if(process.env.DEVELOP === "true") {
                console.log('droit du role interdit');
                console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
                return res.status(401).redirect("http://localhost:8080/login");//page de connexion
            } else {
                logger.error('droit du role interdit');
                return res.status(401).redirect("http://localhost:8080/login");//page de connexion
            }
          }
      }
    })
    .catch(error => {
        if(process.env.DEVELOP === "true") {  
            console.log(error, error);      
            console.log("Pb BDD Users");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
            res.status(500).redirect("http://localhost:8080/login");
        } else {
            logger.error("Pb BDD Users");
            res.status(500).redirect("http://localhost:8080/login");
        }
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
        return res.status(401).json({ message: 'Missing token in cookie' });
      } else {
        logger.error('accessToken manquant');
        return res.status(401).json({ error: process.env.MSG_ERROR_PRODUCTION });
      }
      
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
            return res.status(401).redirect("http://localhost:8080/login");//page de connexion
        } else {
            logger.error('user introuvable dans la BDD');
            return res.status(401).redirect("http://localhost:8080/login");//page de connexion
        }
      } else {
          if((result.role === config.role.roleAmateur) ||
            (result.role === config.role.roleExpert) || (result.role === config.role.roleAdmin)){
            req.body.role = result.role;
            next();
          } else {
            if(process.env.DEVELOP === "true") {
                console.log('droit du role interdit');
                console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
                return res.status(401).redirect("http://localhost:8080/login");//page de connexion
            } else {
                logger.error('droit du role interdit');
                return res.status(401).redirect("http://localhost:8080/login");//page de connexion
            }
          }
      }
    })
    .catch(error => {
        if(process.env.DEVELOP === "true") {  
            console.log(error, error);      
            console.log("Pb BDD Users");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
            res.status(500).redirect("http://localhost:8080/login");
        } else {
            logger.error("Pb BDD Users");
            res.status(500).redirect("http://localhost:8080/login");
        }
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
        return res.status(401).json({ message: 'Missing token in cookie' });
      } else {
        logger.error('accessToken manquant');
        return res.status(401).json({ error: process.env.MSG_ERROR_PRODUCTION });
      }
      
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
            return res.status(401).redirect("http://localhost:8080/login");//page de connexion
        } else {
            logger.error('user introuvable dans la BDD');
            return res.status(401).redirect("http://localhost:8080/login");//page de connexion
        }
      } else {
          if((result.role === config.role.roleExpert) || (result.role === config.role.roleAdmin)){
            req.body.role = result.role;
            next();
          } else {
            if(process.env.DEVELOP === "true") {
                console.log('droit du role interdit');
                console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
                return res.status(401).redirect("http://localhost:8080/login");//page de connexion
            } else {
                logger.error('droit du role interdit');
                return res.status(401).redirect("http://localhost:8080/login");//page de connexion
            }
          }
      }
    })
    .catch(error => {
        if(process.env.DEVELOP === "true") {  
            console.log(error, error);      
            console.log("Pb BDD Users");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
            res.status(500).redirect("http://localhost:8080/login");
        } else {
            logger.error("Pb BDD Users");
            res.status(500).redirect("http://localhost:8080/login");
        }
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
        return res.status(401).json({ message: 'Missing token in cookie' });
      } else {
        logger.error('accessToken manquant');
        return res.status(401).json({ error: process.env.MSG_ERROR_PRODUCTION });
      }
      
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
            return res.status(401).redirect("http://localhost:8080/login");//page de connexion
        } else {
            logger.error('user introuvable dans la BDD');
            return res.status(401).redirect("http://localhost:8080/login");//page de connexion
        }
      } else {
          if((result.role === config.role.roleAdmin)){
            req.body.role = result.role;
            next();
          } else {
            if(process.env.DEVELOP === "true") {
                console.log('droit du role interdit');
                console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
                return res.status(401).redirect("http://localhost:8080/login");//page de connexion
            } else {
                logger.error('droit du role interdit');
                return res.status(401).redirect("http://localhost:8080/login");//page de connexion
            }
          }
      }
    })
    .catch(error => {
        if(process.env.DEVELOP === "true") {  
            console.log(error, error);      
            console.log("Pb BDD Users");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
            res.status(500).redirect("http://localhost:8080/login");
        } else {
            logger.error("Pb BDD Users");
            res.status(500).redirect("http://localhost:8080/login");
        }
    });
};