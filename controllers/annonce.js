const User = require('../models/User');
const Annonce = require('../models/Annonce');
const Coloc = require('../models/Coloc');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const moment = require('moment');

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
    //next(false);
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
        //next(false);
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
          annonceActive: false,//Boolean(req.body.annonceActive),
          annonceValide: Boolean(req.body.annonceValide),
          meuble: Boolean(req.body.meuble),
          
          laveVaisselle: Boolean(req.body.laveVaisselle),
          wifi: Boolean(req.body.wifi),
          cuisineEquipe: Boolean(req.body.cuisineEquipe),
          television: Boolean(req.body.television),
          laveLinge: Boolean(req.body.laveLinge),
          chemine: Boolean(req.body.chemine),
          radElec: Boolean(req.body.radElec),
          chGaz: Boolean(req.body.chGaz),
          poele: Boolean(req.body.poele),
          detecFumee: Boolean(req.body.detecFumee),
          baignoire: Boolean(req.body.baignoire),
          sdbPriv: Boolean(req.body.sdbPriv),
          secheCheveux: Boolean(req.body.secheCheveux),
          linge: Boolean(req.body.linge),
          couvEtUstensiles: Boolean(req.body.couvEtUstensiles),
          ferRepasser: Boolean(req.body.ferRepasser),
          tancarville: Boolean(req.body.tancarville),
          dressing: Boolean(req.body.dressing),
          verrouCh: Boolean(req.body.verrouCh),
          refri: Boolean(req.body.refri),
          fourMicro: Boolean(req.body.fourMicro),
          equipCuisine: Boolean(req.body.equipCuisine),
          congelo: Boolean(req.body.congelo),
          four: Boolean(req.body.four),
          cafetiere: Boolean(req.body.cafetiere),
          barbecue: Boolean(req.body.barbecue),
          mobilierExt: Boolean(req.body.mobilierExt),
          camExt: Boolean(req.body.camExt),
          femmeDeMenage: Boolean(req.body.femmeDeMenage),
          gardien: Boolean(req.body.gardien),
          rangements: Boolean(req.body.rangements),
          bureau: Boolean(req.body.bureau),
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
            //next(false);
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
      //next(false);
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
    //next(false);
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
      //next(false);
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
          //next(false);
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
        //next(false);
      });
    }
  })
  .catch(error => {
    if(process.env.DEVELOP === "true") {  
      console.log(error);      
      console.log("Pb BDD Annonces find");
      console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
      res.status(config.erreurServer.ERREUR_SERVER);
    } else {
      logger.error("Pb BDD Annonces find");
      res.status(config.erreurServer.ERREUR_SERVER);
    }
    //next(false);
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

      //next(false);
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

          //next(false);
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
        //next(false);
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
    //next(false);
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
    //next(false);
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
  req.body.annonceActive= false;//Boolean(req.body.annonceActive);
  req.body.annonceValide=Boolean(req.body.annonceValide);
  req.body.masquerNumero=Boolean(req.body.masquerNumero);
  req.body.refuseDemarcheCommercial=Boolean(req.body.refuseDemarcheCommercial);
  req.body.meuble=Boolean(req.body.meuble);

  req.body.laveVaisselle=Boolean(req.body.laveVaisselle);
  req.body.wifi=Boolean(req.body.wifi);
  req.body.cuisineEquipe=Boolean(req.body.cuisineEquipe);
  req.body.television=Boolean(req.body.television);
  req.body.laveLinge=Boolean(req.body.laveLinge);
  req.body.chemine=Boolean(req.body.chemine);
  req.body.radElec=Boolean(req.body.radElec);
  req.body.chGaz=Boolean(req.body.chGaz);
  req.body.poele=Boolean(req.body.poele);
  req.body.detecFumee=Boolean(req.body.detecFumee);
  req.body.baignoire=Boolean(req.body.baignoire);
  req.body.sdbPriv=Boolean(req.body.sdbPriv);
  req.body.secheCheveux=Boolean(req.body.secheCheveux);
  req.body.linge=Boolean(req.body.linge);
  req.body.couvEtUstensiles=Boolean(req.body.couvEtUstensiles);
  req.body.ferRepasser=Boolean(req.body.ferRepasser);
  req.body.tancarville=Boolean(req.body.tancarville);
  req.body.dressing=Boolean(req.body.dressing);
  req.body.verrouCh=Boolean(req.body.verrouCh);
  req.body.refri=Boolean(req.body.refri);
  req.body.fourMicro=Boolean(req.body.fourMicro);
  req.body.equipCuisine=Boolean(req.body.equipCuisine);
  req.body.congelo=Boolean(req.body.congelo);
  req.body.four=Boolean(req.body.four);
  req.body.cafetiere=Boolean(req.body.cafetiere);
  req.body.barbecue=Boolean(req.body.barbecue);
  req.body.mobilierExt=Boolean(req.body.mobilierExt);
  req.body.camExt=Boolean(req.body.camExt);
  req.body.femmeDeMenage=Boolean(req.body.femmeDeMenage);
  req.body.gardien=Boolean(req.body.gardien);
  req.body.rangements=Boolean(req.body.rangements);
  req.body.bureau=Boolean(req.body.bureau);

  const refAnnonce = req.body.ref;
  delete req.body.ref;
  delete req.body.role;

  if(chatty){  
    console.log('photo', req.body.photos)
    console.log('body', req.body)
  }

  Annonce.findOneAndUpdate({ _id: refAnnonce, userId: decodedToken.sub }, { ...req.body, _id: refAnnonce, userId: decodedToken.sub, datePoster: moment() })
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
      //next(false);
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
    //next(false);
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
        res.status(200).json({ message: "Suppression une photo de l'annonce ok !" });
      } else {
        res.status(200).json({ message: process.env.MSG_OK_PRODUCTION });
        logger.info("Suppression une photo de l'annonce ok !");
      }

      if(process.env.DEVELOP === "true") console.log("Suppression une photo de l'annonce ok !");
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
      //next(false);
    }
  });
};

exports.getAnnonces = (req, res, next) => {
  if(process.env.DEVELOP === "true") console.log("fonction getAnnonces !");
  else logger.info("Requête getAnnonces lancée !");

  Annonce.find({annonceActive: true, annonceValide: true}, {_id: 0, photos: 1, titreAnnonce: 2, loyerHC: 3, charges: 4, lieu: 5, datePoster: 6, _id: 7 })
  .then((annonces) => {

    if(process.env.DEVELOP === "true") {
      console.log("then getAnnonces");
      res.status(200).json({ message: 'Informations annonces transmisent !', annoncesSimple: annonces });
    } else {
      res.status(200).json({ message: process.env.MSG_OK_PRODUCTION, annoncesSimple: annonces });
      logger.info("Informations annonces transmisent !");
    }
    if(process.env.DEVELOP === "true") console.log('Informations annonces transmisent !');
    next();
    
  })
  .catch(error => {
    if(process.env.DEVELOP === "true") {  
      console.log(error, error);      
      console.log("Pb BDD Annonces getAnnonces");
      console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
      res.status(config.erreurServer.ERREUR_SERVER);
    } else {
      logger.error("Pb BDD Annonces getAnnonces");
      res.status(config.erreurServer.ERREUR_SERVER);
    }
    //next(false);
  });
};

exports.getMesAnnonces = (req, res, next) => {
  if(process.env.DEVELOP === "true") console.log("fonction getMesAnnonces !");
  else logger.info("Requête getMesAnnonces lancée !");

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
    //next(false);
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
        //next(false);
      } else {//on envoie les informations des annonces de l'utilisateur

        Annonce.find({userId: decodedToken.sub }, { _id: 0, photos: 1, titreAnnonce: 2, loyerHC: 3, charges: 4, lieu: 5, datePoster: 6, _id: 7 })
        .then((annonces) => {
          if(process.env.DEVELOP === "true") {
            console.log("then getMesAnnonces");
            res.status(200).json({ message: 'Informations mes annonces transmisent !', mesAnnoncesSimple: annonces });
          } else {
            res.status(200).json({ message: process.env.MSG_OK_PRODUCTION, mesAnnoncesSimple: annonces });
            logger.info("Informations mes annonces transmisent !");
          }
          if(process.env.DEVELOP === "true") console.log('Informations mes annonces transmisent !');
          next();
        })
        .catch(error => {
          if(process.env.DEVELOP === "true") {  
            console.log(error, error);      
            console.log("Pb BDD Annonces getMesAnnonces");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
            res.status(config.erreurServer.ERREUR_SERVER);
          } else {
            logger.error("Pb BDD Annonces getMesAnnonces");
            res.status(config.erreurServer.ERREUR_SERVER);
          }
          //next(false);
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
      //next(false);
    });
};

exports.getOneAnnonce = (req, res, next) => {
  if(process.env.DEVELOP === "true") console.log("fonction getOneAnnonce !");
  else logger.info("Requête getOneAnnonce lancée !");

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
    //next(false);
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
        //next(false);
      } else {//on sauvegarde la nouvelle annonce

        Annonce.findOne({ _id: req.body.ref }, { userId: 0, _id: 0 })//0 supp le champ dans la réponse
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

              //next(false);
            } else {
              //console.log('annonce', annonce);

              if(process.env.DEVELOP === "true") {
                console.log("then getOneAnnonce");
                res.status(200).json({ message: 'Informations one annonce transmisent !', annonce });
              } else {
                res.status(200).json({ message: process.env.MSG_OK_PRODUCTION, annonce });
                logger.info("Informations one annonce transmisent !");
              }
            
              if(process.env.DEVELOP === "true") console.log('Informations one annonce transmisent !');
              next();
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
            //next(false);
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
      //next(false);
    });
};

exports.suppPhotosAnnonce = (req, res, next) => {//recherche les photos qui ne sont pas dans la requête et supp les urls dans la BDD
  if(process.env.DEVELOP === "true") console.log("fonction suppPhotosAnnonce !");
  else logger.info("Requête suppPhotosAnnonce lancée !");

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
    //next(false);
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
            res.status(config.erreurServer.BAD_REQUEST);
        } else {
            logger.error('User introuvable dans la BDD');
            res.status(config.erreurServer.BAD_REQUEST);
        }
        //next(false);
      } else {//On recherche les urls des photos initials

        Annonce.find({ _id: req.body.ref, userId: decodedToken.sub }, { _id: 0, photos: 1 })
        .then((urlsInitial) => {
          if(chatty) {
            console.log('urlsInitial', urlsInitial);
            console.log('urlsInitial photos', urlsInitial[0].photos);
            console.log('photosBackup', req.body.photos);
          }

          for(const url of urlsInitial[0].photos){
            if(chatty){
              console.log('url link', url);
              console.log('url', req.body.photos);
              var arrBackUp = [...req.body.photos];
              console.log('arrBackUp', arrBackUp);
              console.log(arrBackUp.includes(url));
            }

            if(!req.body.photos.includes(url)){

              fs.unlink(`Images/Annonces/${url.split('/Images/Annonces/')[1]}`, (resp) => {
                if(chatty){
                  console.log('urlPhoto', url)
                  console.log(`Images/Annonces/${url.split('/Images/Annonces/')[1]}`)
                }

                if(process.env.DEVELOP === "true") console.log("Suppression une photo de l'annonce ok !");
                else logger.info("Mise au propre des photos de l'annonce ok !");
              });
            }
          }

          res.status(200).json({ message: process.env.MSG_OK_PRODUCTION });
          next();

          //On met à jour la liste des photos dans la BDD
          Annonce.updateOne({ _id: req.body.ref, userId: decodedToken.sub }, { photos: req.body.photos })
          .then(() => {
            if(process.env.DEVELOP === "true") {
              console.log("suppPhotosAnnonce");
              res.status(200).json({ message: "Mise au propre des photos de l'annonce ok !" });
            } else {
              res.status(200).json({ message: process.env.MSG_OK_PRODUCTION });
              logger.info("Mise au propre des photos de l'annonce ok !");
            }
  
            if(process.env.DEVELOP === "true") console.log("Mise au propre des photos de l'annonce ok !");
            next();
          })
          .catch(error => {
            if(process.env.DEVELOP === "true") {  
              console.log('error', error);      
              console.log("Pb BDD urlsInitial suppPhotosAnnonce");
              console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
              res.status(config.erreurServer.ERREUR_SERVER);
            } else {
              logger.error("Pb BDD urlsInitial suppPhotosAnnonce");
              res.status(config.erreurServer.ERREUR_SERVER);
            }
            //next(false);
          });
        })
        .catch(error => {
          if(process.env.DEVELOP === "true") {  
            console.log('error', error);      
            console.log("Pb BDD Annonces suppPhotosAnnonce");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
            res.status(config.erreurServer.ERREUR_SERVER);
          } else {
            logger.error("Pb BDD Annonces suppPhotosAnnonce");
            res.status(config.erreurServer.ERREUR_SERVER);
          }
          //next(false);
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
      //next(false);
    });
};

exports.getFavorisAnnonces = (req, res, next) => {
  if(process.env.DEVELOP === "true") console.log("fonction getFavorisAnnonces !");
  else logger.info("Requête getFavorisAnnonces lancée !");

  var listeFavorisAnnonces = new Array();

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
    //next(false);
  }
  const accessToken = cookies.access_token;

  const decodedToken = jwt.verify(accessToken, config.token.accessToken.secret, {
      algorithms: config.token.accessToken.algorithm
    });
  if(process.env.DEVELOP === "true") console.log('decodedToken', decodedToken);

  Coloc.findOne({ userId: decodedToken.sub })
  .then(async (c) => {
    if(!c) {//id non trouvé
          
      if(chatty) {//Pas de zone de recherche renseignée
        console.log('id coloc non trouvé');
      }

      res.status(200).json({ listeFavorisAnnonces: listeFavorisAnnonces });
      next();

    } else {

      if(chatty) {
        console.log('id coloc trouvé');
      }

      favorisAnnonces = c.favoris_annonces;

      for (const favoris in favorisAnnonces) {
        if(chatty) console.log('annonce', favorisAnnonces[favoris])
  
        await Annonce.findOne({ annonceActive: true, annonceValide: true, _id: favorisAnnonces[favoris] }, { _id: 0, photos: 1, titreAnnonce: 2, loyerHC: 3, charges: 4, lieu: 5, datePoster: 6, _id: 7 })
        .then((annonces) => {
          if(!annonces) {//ref non trouvé
            if(chatty) {//Pas de zone de recherche renseignée
              console.log('ref annonce non trouvé');
            }
          } else {
            if(chatty) {
              console.log('ref annonce trouvé');
              console.log('annonces', annonces);
            }
            
            listeFavorisAnnonces.push({ 
              photos: annonces.photos,
              titreAnnonce: annonces.titreAnnonce,
              loyerHC: annonces.loyerHC,
              charges: annonces.charges,
              lieu: annonces.lieu,
              datePoster: annonces.datePoster,
              _id: annonces._id
            });
          }
        })
        .catch(error => {
          if(process.env.DEVELOP === "true") {  
            console.log(error, error);      
            console.log("Pb BDD Annonces getFavorisAnnonces");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
            res.status(config.erreurServer.ERREUR_SERVER);
          } else {
            logger.error("Pb BDD Annonces getFavorisAnnonces");
            res.status(config.erreurServer.ERREUR_SERVER);
          }
          //next(false);
        });
      }
      if(chatty) console.log('listeFavorisAnnonces', listeFavorisAnnonces);
  
      res.status(200).json({ listeFavorisAnnonces: listeFavorisAnnonces });
      next();
    }
  })
  .catch(error => {//Pb avec la BDD
    if(process.env.DEVELOP === "true") {
      console.log('erreur pour accèder à la BDD coloc pour getFavorisAnnonces');
      console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
      res.status(400).json({ error });
    } else {
      logger.error("erreur pour accèder à la BDD coloc pour getFavorisAnnonces");
      console.log(process.env.MSG_ERROR_PRODUCTION);
      res.status(400).json({ message: process.env.MSG_ERROR_PRODUCTION });
    }
  });
};

exports.setFavorisAnnonces = (req, res, next) => {
  if(process.env.DEVELOP === "true") console.log("fonction setFavorisAnnonces !");
  else logger.info("Requête setFavorisAnnonces lancée !");

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
    //next(false);
  }
  const accessToken = cookies.access_token;

  const decodedToken = jwt.verify(accessToken, config.token.accessToken.secret, {
      algorithms: config.token.accessToken.algorithm
    });
  if(process.env.DEVELOP === "true") console.log('decodedToken', decodedToken);

  Coloc.findOne({ userId: decodedToken.sub })
  .then((coloc) => {//Pas de problème avec la BDD
    if(!coloc) {
      if(process.env.DEVELOP === "true") {
          console.log('coloc introuvable dans la BDD');
      } else {
          logger.error('coloc introuvable dans la BDD');
      }

      const myColoc = new Coloc({
        userId: decodedToken.sub,
        distance: 0,
        budget: 0,
        age: 18,
        situation: 'etudiant',
        rechercheActive: Boolean(false),
        favoris_annonces: [req.body.ref]
      });
      Coloc.save({ userId: decodedToken.sub }, myColoc)
      .then(() => {
        res.status(201).json({ message: process.env.MSG_OK_PRODUCTION });
        next();
      })
      .catch(error => {
        if(process.env.DEVELOP === "true") {  
          console.log(error);      
          console.log("Pb BDD Coloc save");
          console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
          res.status(config.erreurServer.ERREUR_SERVER);
        } else {
          logger.error("Pb BDD Coloc save");
          res.status(config.erreurServer.ERREUR_SERVER);
        }
        //next(false);
      });
    } else {
      if(coloc.favoris_annonces.find(elm => elm === req.body.ref)){//On vérifie si déjà dans les favoris
        //Si oui on le supprime
        coloc.favoris_annonces.splice(coloc.favoris_annonces.indexOf(req.body.ref), 1);
      } else {
        //si non on l'ajoute
        coloc.favoris_annonces.push(req.body.ref);
      }

      Coloc.updateOne({ userId: decodedToken.sub }, coloc)
      .then(() => {
        res.status(201).json({ message: process.env.MSG_OK_PRODUCTION });
        next();
      })
      .catch(error => {
        if(process.env.DEVELOP === "true") {  
          console.log(error);      
          console.log("Pb BDD Coloc updateOne");
          console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
          res.status(config.erreurServer.ERREUR_SERVER);
        } else {
          logger.error("Pb BDD Coloc updateOne");
          res.status(config.erreurServer.ERREUR_SERVER);
        }
        //next(false);
      });
    }

    
  })
  .catch(error => {
    if(process.env.DEVELOP === "true") {  
      console.log(error);      
      console.log("Pb BDD Coloc findOne");
      console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
      res.status(config.erreurServer.ERREUR_SERVER);
    } else {
      logger.error("Pb BDD Coloc findOne");
      res.status(config.erreurServer.ERREUR_SERVER);
    }
    //next(false);
  });

};

exports.getFavorisRefAnnonce = (req, res, next) => {
  if(process.env.DEVELOP === "true") console.log("fonction getFavorisRefAnnonce !");
  else logger.info("Requête getFavorisRefAnnonce lancée !");

  const { cookies } = req;
  
  if (!cookies || !cookies.access_token) {//cookie présent ?
    if(process.env.DEVELOP === "true") {
      console.log('accessToken manquant');
    } else {
      logger.error('accessToken manquant');
    }
    res.status(config.erreurServer.BAD_IDENTIFICATION);

  } else {
    const accessToken = cookies.access_token;

    const decodedToken = jwt.verify(accessToken, config.token.accessToken.secret, {
        algorithms: config.token.accessToken.algorithm
      });
    if(process.env.DEVELOP === "true") console.log('decodedToken', decodedToken);

    Coloc.findOne({ userId: decodedToken.sub }, { _id: 0, favoris_annonces: 1 })
    .then((favoris) => {
      if(process.env.DEVELOP === "true") {
        console.log("then getFavorisRefAnnonce");
        res.status(200).json({ message: "Informations favoris ref transmisent !", favoris: favoris.favoris_annonces });
      } else {
        res.status(200).json({ message: process.env.MSG_OK_PRODUCTION, favoris: favoris.favoris_annonces });
        logger.info("Informations favoris ref transmisent !");
      }
      if(process.env.DEVELOP === "true") console.log("Informations favoris ref transmisent !");
      next();
    })
    .catch(error => {
      if(process.env.DEVELOP === "true") {  
        console.log(error, error);      
        console.log("Pb BDD Colocs getFavorisRefAnnonce");
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        res.status(config.erreurServer.ERREUR_SERVER);
      } else {
        logger.error("Pb BDD Colocs getFavorisRefAnnonce");
        res.status(config.erreurServer.ERREUR_SERVER);
      }
      //next(false);
    });
  }
};