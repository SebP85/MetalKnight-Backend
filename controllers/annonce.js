const User = require('../models/User');
const Annonce = require('../models/Annonce');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const config = require('../config/config');
const { logger } = require('../log/winston');

var chatty = false;

exports.addAnnonce = (req, res, next) => {//Role autorisé Free
  if(process.env.DEVELOP === "true") console.log("fonction addAnnonce !");
  else logger.info("Requête addAnnonce lancée !");

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


  User.findOne({ _id: decodedToken.sub })
    .then((user) => {//Pas de problème avec la BDD
      if(!user) {
        if(process.env.DEVELOP === "true") {
            console.log('User introuvable dans la BDD');
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
            res.status(config.erreurServer.BAD_REQUEST).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");//page de connexion
        } else {
            logger.error('User introuvable dans la BDD');
            res.status(config.erreurServer.BAD_REQUEST).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");//page de connexion
        }
        next(false);
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
          .then((annonceSaved) => {//enregistrement ok

            if(process.env.DEVELOP === "true") {
              console.log("then annonce");
              res.status(201).json({ refAnnonce: annonceSaved._id, message: 'Création annonce ok !' });
            } else {
              res.status(201).json({ refAnnonce: annonceSaved._id, message: process.env.MSG_OK_PRODUCTION });
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
            next(false);
          });
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

exports.addPhotoAnnonce = (req, res, next) => {//Role autorisé Free
  if(process.env.DEVELOP === "true") console.log("fonction addPhotoAnnonce !");
  else logger.info("Requête addPhotoAnnonce lancée !");

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

  const pathPhotoAnnonce = `${req.protocol}://${req.get('host')}/Images/Annonces/${req.file.filename}`;
  if(chatty){
    console.log("ref", req.body.ref)
    console.log('On ajoute le lien url dans la bdd')
    console.log("urlPhoto", pathPhotoAnnonce)
  }

  Annonce.findOne({ _id: req.body.ref, userId: decodedToken.sub })
  .then((annonce) => {//Pas de problème avec la BDD
    
    if(!annonce) {
      if(process.env.DEVELOP === "true") {
          console.log('Annonce introuvable dans la BDD');
          console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
          res.status(config.erreurServer.BAD_REQUEST);
      } else {
          logger.error('Annonce introuvable dans la BDD');
          res.status(config.erreurServer.BAD_REQUEST);
      }
      next(false);
    } else {//on met à jour l'annonce

      if(chatty) console.log("annonce.photos avant", annonce.photos)
      annonce.photos.push(pathPhotoAnnonce)
      if(chatty) console.log("annonce.photos après", annonce.photos)

      Annonce.updateOne({ _id: req.body.ref, userId: decodedToken.sub }, { photos: annonce.photos,_id: req.body.ref, userId: decodedToken.sub })
      .then((annonce) => {//Pas de problème avec la BDD
    
        if(!annonce) {
          if(process.env.DEVELOP === "true") {
              console.log('Annonce introuvable dans la BDD');
              console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
              res.status(config.erreurServer.BAD_REQUEST);
          } else {
              logger.error('Annonce introuvable dans la BDD');
              res.status(config.erreurServer.BAD_REQUEST);
          }
          next(false);
        } else {//on met à jour l'annonce

          if(process.env.DEVELOP === "true") {
            console.log("then addPhotoAnnonce");
            res.status(201).json({ message: 'Création photo ok !', photo: pathPhotoAnnonce });
          } else {
            res.status(201).json({ message: process.env.MSG_OK_PRODUCTION, photo: pathPhotoAnnonce });
            logger.info("Création photo ok");
          }
        
          if(process.env.DEVELOP === "true") console.log('Création photo enregistré !');
        
          next();
        }
      })
      .catch(error => {
        if(process.env.DEVELOP === "true") {  
          console.log(error, error);      
          console.log("Pb BDD Annonces update");
          console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
          res.status(config.erreurServer.ERREUR_SERVER);
        } else {
          logger.error("Pb BDD Annonces update");
          res.status(config.erreurServer.ERREUR_SERVER);
        }
        next(false);
      });
    }
  })
  .catch(error => {
    if(process.env.DEVELOP === "true") {  
      console.log(error, error);      
      console.log("Pb BDD Annonces find");
      console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
      res.status(config.erreurServer.ERREUR_SERVER);
    } else {
      logger.error("Pb BDD Annonces find");
      res.status(config.erreurServer.ERREUR_SERVER);
    }
    next(false);
  });
};

exports.suppAnnonce = (req, res, next) => {
  if(process.env.DEVELOP === "true") console.log("fonction suppAnnonce !");
  else logger.info("Requête suppAnnonce lancée !");

  if(chatty) {
    console.log('ref=', req.body.ref);

    console.log('On supp les Photos')//On supprime toutes les photos
  }

  Annonce.findOne({ _id: req.body.ref })
  .then((annonce) => {
    
    if(!annonce){
      if(process.env.DEVELOP === "true") {
        console.log('Annonce introuvable dans la BDD');
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
        res.status(config.erreurServer.BAD_REQUEST);
      } else {
        logger.error('Ref introuvable dans la BDD');
        res.status(config.erreurServer.BAD_REQUEST);
      }

      next(false);
    } else {

      Annonce.deleteOne({ _id: req.body.ref })
      .then((resp) => {//On supprime les photos s'il y en avait d'enregistré
        for(const link of annonce.photos)
          fs.unlink(`Images/Annonces/${link.split('/Images/Annonces/')[1]}`, () => {
            if(chatty){
              console.log('link', link)
              console.log(`Images/Annonces/${link.split('/Images/Annonces/')[1]}`)
            }
          })
    
        if(!resp){
          if(process.env.DEVELOP === "true") {
            console.log("then annonce");
            res.status(config.erreurServer.BAD_REQUEST).json({ message: 'Suppression annonce nok !' });
          } else {
            res.status(config.erreurServer.BAD_REQUEST).json({ message: 'Suppression annonce nok !' });
            logger.error("Suppression annonce nok");
          }
      
          if(process.env.DEVELOP === "true") console.log('Suppression annonce nok !');

          next(false);
        } else {
          if(process.env.DEVELOP === "true") {
            console.log("then annonce");
            res.status(200).json({ message: 'Suppression annonce ok !' });
          } else {
            res.status(200).json({ message: 'Suppression annonce ok !' });
            logger.info("Suppression annonce ok");
          }
      
          if(process.env.DEVELOP === "true") console.log('Suppression annonce ok !');
      
          next();
        }
      })
      .catch(error => {
        if(process.env.DEVELOP === "true") {  
          console.log(error, error);      
          console.log("Pb BDD Annonces");
          console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
          res.status(config.erreurServer.ERREUR_SERVER);
        } else {
          logger.error("Pb BDD Annonces");
          res.status(config.erreurServer.ERREUR_SERVER);
        }
        next(false);
      });
    }
  })
  .catch(error => {
    if(process.env.DEVELOP === "true") {  
      console.log(error, error);      
      console.log("Pb BDD Annonces suppPhotoBDD");
      console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
      res.status(config.erreurServer.ERREUR_SERVER);
    } else {
      logger.error("Pb BDD Annonces suppPhotoBDD");
      res.status(config.erreurServer.ERREUR_SERVER);
    }
    next(false);
  });
};

exports.updateAnnonce = (req, res, next) => {
  if(process.env.DEVELOP === "true") console.log("fonction updateAnnonce !");
  else logger.info("Requête updateAnnonce lancée !");

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

  delete req.body.datePoster;
  req.body.loyerHC=Number(req.body.loyerHC);
  req.body.charges=Number(req.body.charges);
  req.body.nbreColocataire=Number(req.body.nbreColocataire);
  req.body.nbreColocOccupants=Number(req.body.nbreColocOccupants);
  req.body.tel=String(req.body.tel);
  req.body.surface=Number(req.body.surface);
  req.body.nbrePieces=Number(req.body.nbrePieces);
  req.body.annonceActive=Boolean(req.body.annonceActive);
  req.body.annonceValide=Boolean(req.body.annonceValide);
  req.body.masquerNumero=Boolean(req.body.masquerNumero);
  req.body.refuseDemarcheCommercial=Boolean(req.body.refuseDemarcheCommercial);
  const refAnnonce = req.body.ref;
  delete req.body.ref;
  delete req.body.role;

  if(chatty){  
    console.log('photo', req.body.photos)
    console.log('body', req.body)
  }

  Annonce.findOneAndUpdate({ _id: refAnnonce, userId: decodedToken.sub }, { ...req.body, _id: refAnnonce, userId: decodedToken.sub })
  .then((annonce) => {//Pas de problème avec la BDD
    
    if(!annonce) {
      if(process.env.DEVELOP === "true") {
          console.log('Annonce introuvable dans la BDD');
          console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
          res.status(config.erreurServer.BAD_REQUEST);
      } else {
          logger.error('Annonce introuvable dans la BDD');
          res.status(config.erreurServer.BAD_REQUEST);
      }
      next(false);
    } else {//on met à jour l'annonce
      if(chatty)
      {
        console.log("Mise à jour de l'annonce");
        console.log("annonce", annonce);
      }

      if(process.env.DEVELOP === "true") {
        console.log("then annonce");
        res.status(201).json({ message: 'Mise à jour annonce ok !' });
      } else {
        res.status(201).json({ message: process.env.MSG_OK_PRODUCTION });
        logger.info("Mise à jour annonce ok");
      }

      if(process.env.DEVELOP === "true") console.log('Création annonce enregistré !');

      next();
    }
  })
  .catch(error => {
    if(process.env.DEVELOP === "true") {  
      console.log('error', error);
      console.log("Pb BDD Annonces");
      console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
      res.status(config.erreurServer.ERREUR_SERVER);
    } else {
      logger.error("Pb BDD Annonces");
      res.status(config.erreurServer.ERREUR_SERVER);
    }
    next(false);
  });
};

exports.suppOnePhotoAnnonce = (req, res, next) => {
  if(process.env.DEVELOP === "true") console.log("fonction suppOnePhotoAnnonce !");
  else logger.info("Requête suppOnePhotoAnnonce lancée !");

  fs.unlink(`Images/Annonces/${req.body.urlPhoto.split('/Images/Annonces/')[1]}`, (resp) => {
    if(chatty){
      console.log('urlPhoto', req.body.urlPhoto)
      console.log(`Images/Annonces/${req.body.urlPhoto.split('/Images/Annonces/')[1]}`)
    }

    if(resp===null){
      if(process.env.DEVELOP === "true") {
        console.log("then annonce");
        res.status(200).json({ message: 'Suppression annonce ok !' });
      } else {
        res.status(200).json({ message: process.env.MSG_OK_PRODUCTION });
        logger.info("Suppression annonce ok");
      }

      if(process.env.DEVELOP === "true") console.log('Suppression annonce ok !');
      next();
    } else {
      if(process.env.DEVELOP === "true") {  
        console.log(error, error);      
        console.log("Pb suppOnePhotoAnnonce");
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        res.status(config.erreurServer.ERREUR_SERVER);
      } else {
        logger.error("Pb suppOnePhotoAnnonce");
        res.status(config.erreurServer.ERREUR_SERVER);
      }
      next(false);
    }
  });
};