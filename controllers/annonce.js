const User = require('../models/User');
const Annonce = require('../models/Annonce');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const config = require('../config/config');
const { logger } = require('../log/winston');

var chatty = false;

exports.addAnnonce = (req, res, next) => {//Role autorisé Free
  if(process.env.DEVELOP === "true") console.log("fonction setAnnonce !");
  else logger.info("Requête setAnnonce lancée !");

  const { cookies } = req;
  
  if (!cookies || !cookies.access_token) {//cookie présent ?
    if(process.env.DEVELOP === "true") {
      console.log('accessToken manquant');
      console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
      return res.status(config.erreurServer.BAD_REQUEST).json({ message: 'Missing token in cookie' });
    } else {
      logger.error('accessToken manquant');
      return res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
    }
    
  }
  const accessToken = cookies.access_token;

  const decodedToken = jwt.verify(accessToken, config.token.accessToken.secret, {
      algorithms: config.token.accessToken.algorithm
    });
  if(process.env.DEVELOP === "true") console.log('decodedToken', decodedToken);


  User.findOne({ _id: decodedToken.sub })
    .then((user) => {//Pas de problème avec la BDD
      if(!user) {
        if(process.env.DEVELOP === "true") {
            console.log('User introuvable dans la BDD');
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
            return res.status(config.erreurServer.BAD_REQUEST).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");//page de connexion
        } else {
            logger.error('User introuvable dans la BDD');
            return res.status(config.erreurServer.BAD_REQUEST).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");//page de connexion
        }
      } else {//on sauvegarde la nouvelle annonce
            
        const myAnnonce = new Annonce({
          userId: user.id,
          lieu: req.body.lieu,
          loyerHC: Number(req.body.loyerHC),
          charges: Number(req.body.charges),
          type: req.body.type,
          nbreColocataire: Number(req.body.nbreColocataire),
          nbreColocOccupants: Number(req.body.nbreColocOccupants),
          mail: req.body.mail,
          tel: req.body.tel,
          titreAnnonce: req.body.titreAnnonce,
          description: req.body.description,
          surface: Number(req.body.surface),
          nbrePieces: Number(req.body.nbrePieces),
          classEnergie: req.body.classEnergie,
          ges: req.body.ges,
          masquerNumero: Boolean(req.body.masquerNumero),  
          refuseDemarcheCommercial: Boolean(req.body.refuseDemarcheCommercial),
          annonceActive: Boolean(req.body.annonceActive),
          annonceValide: Boolean(req.body.annonceValide),

        });
        if(process.env.DEVELOP === "true") console.log("myAnnonce", myAnnonce);
        
        myAnnonce.save()
          .then(() => {//enregistrement ok

            if(process.env.DEVELOP === "true") {
              console.log("then annonce");
              res.status(201).json({ message: 'Création annonce ok !' });
            } else {
              res.status(201).json({ message: process.env.MSG_OK_PRODUCTION });
              logger.info("Création annonce ok");
            }

            if(process.env.DEVELOP === "true") console.log('Création annonce enregistré !');

            next();
            
          })
          .catch(error => {//Pb avec la BDD
            if(process.env.DEVELOP === "true") {
              console.log("erreur pour enregistrer les paramètres de l'annonce save");
              console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
              res.status(400).json({ error });
            } else {
              logger.error("Erreur MongoDB pour enregistrer les paramètres de l'annonce save");
              console.log(process.env.MSG_ERROR_PRODUCTION);
              res.status(400).json({ message: process.env.MSG_ERROR_PRODUCTION });
            }
          });
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
    });

};

exports.addPhotoAnnonce = (req, res, next) => {//Role autorisé Free
  if(process.env.DEVELOP === "true") console.log("fonction addPhotoAnnonce !");
  else logger.info("Requête addPhotoAnnonce lancée !");

  const pathPhotoAnnonce = `${req.protocol}://${req.get('host')}/Images/Annonces/${req.file.filename}`;

  if(process.env.DEVELOP === "true") {
    console.log("then addPhotoAnnonce");
    res.status(201).json({ message: 'Création photo ok !' });
  } else {
    res.status(201).json({ message: process.env.MSG_OK_PRODUCTION });
    logger.info("Création photo ok");
  }

  if(process.env.DEVELOP === "true") console.log('Création photo enregistré !');

  next();
};

exports.getRefAnnonce = (req, res, next) => {

};