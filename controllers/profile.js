const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');

const config = require('../config/config');
const mail = require("../controllers/mail");
const { logger } = require('../log/winston');

exports.getProfile = (req, res, next) => {//Role autorisé Free
    if(process.env.DEVELOP === "true") console.log("fonction getProfile !");
    else logger.info("Requête getProfile lancée !");

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

    User.findOne({ _id: decodedToken.sub })
    .then((result) => {//Pas de problème avec la BDD
        if(!result) {
            if(process.env.DEVELOP === "true") {
                console.log('Profil introuvable dans la BDD');
                console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
                return res.status(401).redirect("http://localhost:8080/login");//page de connexion
            } else {
                logger.error('Profil introuvable dans la BDD');
                return res.status(401).redirect("http://localhost:8080/login");//page de connexion
            }
          } else {
            res.status(200).json({
                role: result.role,
                email: result.email,
                firstName: result.firstName,
                lastName: result.lastName,
                individu: result.individu,
                birthday: result.birthday,
                civilite: result.civilite
            });

            next();
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