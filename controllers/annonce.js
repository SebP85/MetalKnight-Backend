const User = require('../models/User');
const Coloc = require('../models/Coloc');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const config = require('../config/config');
const { logger } = require('../log/winston');

var chatty = false;

exports.setAnnonce = (req, res, next) => {//Role autorisé Free
    if(process.env.DEVELOP === "true") console.log("fonction setAnnonce !");
    else logger.info("Requête setAnnonce lancée !");



    if(process.env.DEVELOP === "true") {
        console.log("then annonce");
        res.status(201).json({ message: 'Création annonce ok !' });
    } else {
        res.status(201).json({ message: process.env.MSG_OK_PRODUCTION });
        logger.info("Création annonce ok");
    }

    next();
};

exports.setZoneRecherche = (req, res, next) => {//Role autorisé Free
    if(process.env.DEVELOP === "true") console.log("fonction setZoneRecherche !");
    else logger.info("Requête setZoneRecherche lancée !");

    //console.log('req', req.body)

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
          } else {
            //console.log("user id", user.id);
            //On cherche dans la base de donnée Coloc
            Coloc.findOne({ userId: user.id })//Coloc non trouvé => on créait le coloc et on enregistre les paramètres
            .then((resultColoc) => {

              if(!resultColoc) {
                if(process.env.DEVELOP === "true") console.log("id coloc non trouvé");
                
                const myColoc = new Coloc({
                  userId: user.id,
                  lieu: req.body.lieu,
                  distance: Number(req.body.distance),
                  budget: req.body.budget,
                  commentaire: req.body.commentaire,
                  tel: req.body.tel,
                  age: req.body.age,
                  situation: req.body.situation,
                  rechercheActive: Boolean(req.body.rechercheActive)
                });
                if(process.env.DEVELOP === "true") console.log("myColoc", myColoc);
                
                myColoc.save()
                  .then(() => {//enregistrement ok
                    
                    if(process.env.DEVELOP === "true") {
                      console.log("then coloc");
                      res.status(201).json({ message: 'Création paramètre coloc ok !' });
                    } else {
                      res.status(201).json({ message: process.env.MSG_OK_PRODUCTION });
                      logger.info("Création paramètre coloc ok");
                    }

                    if(process.env.DEVELOP === "true") console.log('Paramètre Coloc enregistré !');

                    next();
                    
                  })
                  .catch(error => {//Pb avec la BDD
                    if(process.env.DEVELOP === "true") {
                      console.log('erreur pour enregistrer les paramètres du coloc save');
                      console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
                      res.status(400).json({ error });
                    } else {
                      logger.error("Erreur MongoDB pour enregistrer les paramètres du coloc save");
                      console.log(process.env.MSG_ERROR_PRODUCTION);
                      res.status(400).json({ message: process.env.MSG_ERROR_PRODUCTION });
                    }
                  });
                
              
              } else {//Coloc trouvé => MAJ des données
              if(process.env.DEVELOP === "true") {
                console.log("id Coloc trouvé");
                console.log("resultColoc", resultColoc);
              }
      
              const myColoc = new Coloc({
                _id: resultColoc._id,
                userId: user.id,
                lieu: req.body.lieu,
                distance: Number(req.body.distance),
                budget: req.body.budget,
                commentaire: req.body.commentaire,
                tel: req.body.tel,
                age: req.body.age,
                situation: req.body.situation,
                rechercheActive: Boolean(req.body.rechercheActive)
              });
              if(process.env.DEVELOP === "true") console.log("myColoc", myColoc);
      
              Coloc.updateOne({ _id: resultColoc._id }, myColoc)
                .then(() => {//enregistrement ok
                  if(process.env.DEVELOP === "true") console.log("updateOne ok");
                
                  if(process.env.DEVELOP === "true") {
                    console.log("then coloc");
                    res.status(201).json({ message: 'MAJ paramètre coloc ok !' });
                  } else {
                    res.status(201).json({ message: process.env.MSG_OK_PRODUCTION });
                    logger.info("MAJ paramètre coloc ok", resultColoc._id);
                  }

                  if(process.env.DEVELOP === "true") console.log('Paramètre Coloc enregistré !');
      
                  next();
                  
                })
                .catch(error => {//Pb avec la BDD
                  if(process.env.DEVELOP === "true") console.log("updateOne nok");
                  if(process.env.DEVELOP === "true") {
                    console.log('erreur pour enregistrer les paramètres du coloc updateOne');
                    console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
                    res.status(400).json({ error });
                  } else {
                    logger.error("Erreur MongoDB pour enregistrer les paramètres du coloc updateOne");
                    console.log(process.env.MSG_ERROR_PRODUCTION);
                    res.status(400).json({ message: process.env.MSG_ERROR_PRODUCTION });
                  }
                });
              }
            })
            .catch(error => {
              if(process.env.DEVELOP === "true") {  
                  console.log(error, error);      
                  console.log("Pb BDD Coloc");
                  console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
                  res.status(config.erreurServer.ERREUR_SERVER).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");
              } else {
                  logger.error("Pb BDD Coloc");
                  res.status(config.erreurServer.ERREUR_SERVER).redirect("https://"+process.env.SITE_HOST+":"+process.env.SITE_PORT+"/login");
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
