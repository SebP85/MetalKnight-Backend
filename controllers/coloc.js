const User = require('../models/User');
const Coloc = require('../models/Coloc');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const config = require('../config/config');
const { logger } = require('../log/winston');

var chatty = false;

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

exports.getZoneRecherche = (req, res, next) => {//Role autorisé Free
    if(process.env.DEVELOP === "true") console.log("fonction getZoneRecherche !");
    else logger.info("Requête getZoneRecherche lancée !");

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
            
            /////////
            //On cherche dans la base de donnée Coloc
            Coloc.findOne({ userId: user.id })//Coloc non trouvé => on créait le coloc et on enregistre les paramètres
            .then((resultColoc) => {
              if(!resultColoc) {
                if(process.env.DEVELOP === "true") {
                  console.log('id coloc introuvable dans la BDD');
                  console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');    
                  return res.status(200).json({ message: 'id coloc introuvable dans la BDD' });
                } else {
                    logger.error('id coloc introuvable dans la BDD');
                    return res.status(200).json({ error: process.env.MSG_ERROR_PRODUCTION });
                }

              } else {
                res.status(200).json({
                  lieu: resultColoc.lieu,
                  distance: resultColoc.distance,
                  budget: resultColoc.budget,
                  commentaire: resultColoc.commentaire,
                  tel: resultColoc.tel,
                  age: resultColoc.age,
                  situation: resultColoc.situation,
                  rechercheActive: resultColoc.rechercheActive
                });

                /*
                  console.log('lieu', resultColoc.lieu)
                  console.log('distance', resultColoc.distance)
                  console.log('budget', resultColoc.budget)
                  console.log('commentaire', resultColoc.commentaire)
                  console.log('tel', resultColoc.tel)
                  console.log('age', resultColoc.age)
                  console.log('situation', resultColoc.situation)
                  console.log('rechercheActive', resultColoc.rechercheActive)
                //*/
    
                next();
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

exports.initZoneRecherche = (req, res, next) => {//Role autorisé Free
  if(process.env.DEVELOP === "true") console.log("fonction initZoneRecherche !");
  else logger.info("Requête initZoneRecherche lancée !");

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
          Coloc.findOne({ userId: user.id })//Coloc non trouvé => on fait rien
          .then((resultColoc) => {

            if(!resultColoc) {
              if(process.env.DEVELOP === "true") console.log("id coloc non trouvé");
              
              if(process.env.DEVELOP === "true") {
                res.status(200).json({ message: 'id coloc non trouvé' });
              } else {
                res.status(200).json({ message: process.env.MSG_OK_PRODUCTION });
                logger.info("id coloc non trouvé");
              }
  
              next();
            
            } else {//Coloc trouvé => init des données
            if(process.env.DEVELOP === "true") {
              console.log("id Coloc trouvé");
              console.log("resultColoc", resultColoc);
            }
    
            const myColoc = new Coloc({
              _id: resultColoc._id,
              userId: user.id,
              lieu: "",
              distance: 0,
              budget: 300,
              commentaire: "",
              tel: "",
              age: 18,
              situation: "etudiant",
              rechercheActive: true
            });
            if(process.env.DEVELOP === "true") console.log("myColoc", myColoc);
    
            Coloc.updateOne({ _id: resultColoc._id }, myColoc)
              .then(() => {//enregistrement ok
                if(process.env.DEVELOP === "true") console.log("updateOne ok");
              
                if(process.env.DEVELOP === "true") {
                  console.log("then coloc");
                  res.status(201).json({ message: 'init paramètre coloc ok !' });
                } else {
                  res.status(201).json({ message: process.env.MSG_OK_PRODUCTION });
                  logger.info("init paramètre coloc ok", resultColoc._id);
                }

                if(process.env.DEVELOP === "true") console.log('Paramètre init Coloc enregistré !');
    
                next();
                
              })
              .catch(error => {//Pb avec la BDD
                if(process.env.DEVELOP === "true") console.log("updateOne nok");
                if(process.env.DEVELOP === "true") {
                  console.log('erreur pour initialiser les paramètres du coloc updateOne');
                  console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
                  res.status(400).json({ error });
                } else {
                  logger.error("Erreur MongoDB pour initialiser les paramètres du coloc updateOne");
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

exports.setAvatar = (req, res, next) => {//On vérifie le token recaptcha
  if(process.env.DEVELOP === "true") console.log('Requete setAvatar');
  else logger.info("requête setAvatar");

  const { cookies } = req;
  const accessToken = cookies.access_token;
  const decodedToken = jwt.verify(accessToken, config.token.accessToken.secret, {
    algorithms: config.token.accessToken.algorithm
  });

  const pathAvatar = `${req.protocol}://${req.get('host')}/Images/Avatar/${req.file.filename}`;

  Coloc.findOne({ userId: decodedToken.sub })//Coloc non trouvé => on créait le coloc et on enregistre les paramètres
  .then((resultColoc) => {

    if(!resultColoc) {
      if(process.env.DEVELOP === "true") console.log("id coloc non trouvé");
      
      const myColoc = new Coloc({
        userId: decodedToken.sub,
        lieu: "",
        distance: 0,
        budget: 300,
        commentaire: "",
        tel: "",
        age: 18,
        situation: "etudiant",
        rechercheActive: true,
        avatar: pathAvatar,
      });
      if(process.env.DEVELOP === "true") console.log("myColoc", myColoc);
      
      myColoc.save()
        .then(() => {//enregistrement ok
          
          if(process.env.DEVELOP === "true") {
            console.log("avatar enregistré !");
            res.status(201).json({ message: 'avatar enregistré !' });
          } else {
            res.status(201).json({ message: process.env.MSG_OK_PRODUCTION });
            logger.info("avatar enregistré !");
          }

          next();
          
        })
        .catch(error => {//Pb avec la BDD
          if(process.env.DEVELOP === "true") {
            console.log('erreur pour enregistrer les paramètres du coloc/avatar save');
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
            res.status(400).json({ error });
          } else {
            logger.error("Erreur MongoDB pour enregistrer les paramètres du coloc/avatar save");
            console.log(process.env.MSG_ERROR_PRODUCTION);
            res.status(400).json({ message: process.env.MSG_ERROR_PRODUCTION });
          }
        });
      
    
    } else {//Coloc trouvé => MAJ des données
    if(process.env.DEVELOP === "true") {
      console.log("id Coloc trouvé");
      console.log("resultColoc", resultColoc);
    }

    /*const myColoc = new Coloc({
      _id: resultColoc._id,
      userId: decodedToken.sub,
      lieu: req.body.lieu,
      distance: Number(req.body.distance),
      budget: req.body.budget,
      commentaire: req.body.commentaire,
      tel: req.body.tel,
      age: req.body.age,
      situation: req.body.situation,
      rechercheActive: Boolean(req.body.rechercheActive),
      avatar: pathAvatar,
    });*/

    resultColoc.avatar=pathAvatar;

    if(process.env.DEVELOP === "true") console.log("myColoc", resultColoc);

    Coloc.updateOne({ _id: resultColoc._id }, resultColoc)
      .then(() => {//enregistrement ok

        if(process.env.DEVELOP === "true") {
          console.log("avatar enregistré !");
          res.status(201).json({ message: 'avatar enregistré !' });
        } else {
          res.status(201).json({ message: process.env.MSG_OK_PRODUCTION });
          logger.info("avatar enregistré !");
        }

        next();
        
      })
      .catch(error => {//Pb avec la BDD
        if(process.env.DEVELOP === "true") console.log("updateOne nok");
        if(process.env.DEVELOP === "true") {
          console.log('erreur pour enregistrer les paramètres du coloc/avatar updateOne');
          console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
          res.status(400).json({ error });
        } else {
          logger.error("Erreur MongoDB pour enregistrer les paramètres du coloc/avatar updateOne");
          console.log(process.env.MSG_ERROR_PRODUCTION);
          res.status(400).json({ message: process.env.MSG_ERROR_PRODUCTION });
        }
      });
    }
  })
  .catch(error => {//Pb avec la BDD
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

exports.suppAvatar = (req, res, next) => {//On vérifie le token recaptcha
  if(process.env.DEVELOP === "true") console.log('Requete suppAvatar');
  else logger.info("requête suppAvatar");

  const { cookies } = req;
  const accessToken = cookies.access_token;
  const decodedToken = jwt.verify(accessToken, config.token.accessToken.secret, {
    algorithms: config.token.accessToken.algorithm
  });

  Coloc.findOne({ userId: decodedToken.sub })
    .then(coloc => {

      fs.unlink(`Images/Avatar/${ coloc.avatar.split('/Images/Avatar/')[1]}`, () => {
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
      });
    })
    .catch(error => {//pb avec la bdd coloc
      if(process.env.DEVELOP === "true") {  
        console.log(error, error);      
        console.log("Pb BDD Coloc");
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------'); 
      } else {
          logger.error("Pb BDD Coloc");
      }
      next();
    });
}

exports.getUrlAvatar = (req, res, next) => {
  if(process.env.DEVELOP === "true") console.log('Requete getUrlAvatar');
  else logger.info("requête getUrlAvatar");

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

    Coloc.findOne({ userId: decodedToken.sub })
    .then((coloc) => {//Pas de problème avec la BDD
      if(!coloc) {
              
        if(process.env.DEVELOP === "true") {
          res.status(200).json({ urlAvatar: 'id coloc non trouvé' });
        } else {
          res.status(200).json({ urlAvatar: process.env.MSG_ERROR_PRODUCTION });
          logger.info("id coloc non trouvé");
        }

        next();

      } else {

        if(process.env.DEVELOP === "true") {
          console.log("Url avatar envoyé !");
          res.status(200).json({ urlAvatar: coloc.avatar });
        } else {
          res.status(200).json({ urlAvatar: coloc.avatar });
          logger.info("Url avatar envoyé !");
        }

        next();
      }
    })
    .catch(error => {//Pb avec la BDD
      if(process.env.DEVELOP === "true") {
        console.log('erreur pour accèder à la BDD coloc pour getUrlAvatar');
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        res.status(400).json({ error });
      } else {
        logger.error("erreur pour accèder à la BDD coloc pour getUrlAvatar");
        console.log(process.env.MSG_ERROR_PRODUCTION);
        res.status(400).json({ message: process.env.MSG_ERROR_PRODUCTION });
      }
    });
}

exports.getListeColocs = async (req, res, next) => {
  if(process.env.DEVELOP === "true") console.log('Requete getListeColocs');
  else logger.info("requête getListeColocs");

  var listeColocs = new Array();

  //On recherche la liste des colocataires avec les infos:
  //prénom, age, avatar, commentaire, rechercheActive
  await User.find({userConfirmed: true})
  .then(async (colocs) => {
    if(chatty) console.log('colocs', colocs.length)

    for (const coloc in colocs) {
      if(chatty) console.log('userId', colocs[coloc]._id)

      await Coloc.findOne({ userId: colocs[coloc]._id })
      .then((c) => {
        if(!c) {//id non trouvé
              
          if(chatty) {//Pas de zone de recherche renseignée
            console.log('id coloc non trouvé');
          }
  
        } else {
  
          if(chatty) {
            console.log('id coloc trouvé');
          }

          listeColocs.push({
            'commentaire': c.commentaire,
            'age': c.age,
            avatar: {'source': c.avatar, 'alt': 'avatar'},
            'rechercheActive': c.rechercheActive,
            'note': colocs[coloc].note,
            'firstName': colocs[coloc].firstName
          });

        }
      })
      .catch(error => {//Pb avec la BDD
        if(process.env.DEVELOP === "true") {
          console.log('erreur pour accèder à la BDD coloc pour getListeColocs');
          console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
          res.status(400).json({ error });
        } else {
          logger.error("erreur pour accèder à la BDD coloc pour getListeColocs");
          console.log(process.env.MSG_ERROR_PRODUCTION);
          res.status(400).json({ message: process.env.MSG_ERROR_PRODUCTION });
        }

        next();
      });
    }

    if(chatty) console.log('listeColocs', listeColocs);

    res.status(200).json({ listeColocs: listeColocs });
    next();

  })
  .catch(error => {//Pb avec la BDD
    if(process.env.DEVELOP === "true") {
      console.log('erreur pour accèder à la BDD User pour getListeColocs');
      console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
      res.status(400).json({ error });
    } else {
      logger.error("erreur pour accèder à la BDD User pour getListeColocs");
      console.log(process.env.MSG_ERROR_PRODUCTION);
      res.status(400).json({ message: process.env.MSG_ERROR_PRODUCTION });
    }
  });
}