const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

const config = require('../config/config');
const crypto = require('crypto');
const mail = require("../controllers/mail");
const { logger } = require('../log/winston');
const { log } = require('util');
const moment = require('moment');
const { access } = require('fs');

////////////////////////////////////////////////////////////////////////////   Fonction    /////////////////////////////////////////////////////////////////////////

function compteSuspendu(user) {//comparer la date actuelle avec la date suspendu pour savoir si le compte est suspendu
  if(process.env.DEVELOP === "true") console.log('Fonction compteSuspendu');
  else logger.info("Fonction compteSuspendu lancée !");

  if(process.env.DEVELOP === "true") console.log(user.suspendu);

  var dateSuspendu = moment(user.suspendu);
  var dateNow = moment();

  if(process.env.DEVELOP === "true") {
    console.log("dateSuspendu", dateSuspendu);
    console.log("dateNow", dateNow);
  }

  if(moment(dateNow).isAfter(dateSuspendu)) return false;
  else return true;
};

function envoieToken(user, res, next) {//Permet d'envoyer les données de connexions
  if(process.env.DEVELOP === "true") console.log("fonction envoieToken lancé");

  /* On créer le token CSRF */
  const xsrfToken = crypto.randomBytes(128).toString('hex');
  if(process.env.DEVELOP === "true") console.log("xsrfToken", xsrfToken);

  /* On créer le JWT avec le token CSRF dans le payload */
  if(process.env.DEVELOP === "true") console.log("user.firstName", user.firstName);
  const accessToken = jwt.sign(
    { firstName: user.firstName, lastName: user.lastName, xsrfToken },
    config.token.accessToken.secret,
    {
      algorithm: config.token.accessToken.algorithm,
      audience: config.token.accessToken.audience,
      expiresIn: config.token.accessToken.expiresIn / 1000, // Le délai avant expiration exprimé en seconde
      issuer: config.token.accessToken.issuer,
      subject: user.id.toString() //fonction decoded.sub pour le récupérer
    }
  );
  if(process.env.DEVELOP === "true") console.log("accessToken", accessToken);

  // 7. On créer le refresh token et on le stocke en BDD
  const refreshToken = crypto.randomBytes(128).toString('base64');
  if(process.env.DEVELOP === "true") console.log('refreshToken', refreshToken);

  RefreshToken.findOne({ userId: user.id })
    .then((result) => {
      if(result) {
        if(process.env.DEVELOP === "true") {
          console.log("id refreshToken trouvé");
          console.log("result", result);
        }

        const refresh = new RefreshToken({
          _id: result._id,
          userId: user.id,
          refreshToken: refreshToken,
          expiresAt: Date.now() + config.token.refreshToken.expiresIn
        });
        if(process.env.DEVELOP === "true") console.log("refresh", refresh);

        RefreshToken.updateOne({ _id: result._id }, refresh)
          .then(() => {//enregistrement ok
            if(process.env.DEVELOP === "true") console.log("updateOne ok");
            res.cookie('access_token', accessToken, {//config du cookie accessToken
              maxAge: config.token.accessToken.expiresIn,
              httpOnly: true,
              secure: true,
            });
            if(process.env.DEVELOP === "true") console.log('accessToken setCookie');
          
            res.cookie('refresh_token', refreshToken, {//config du cookie refreshToken
              maxAge: config.token.refreshToken.expiresIn,
              httpOnly: true,
              secure: true,
              path: config.cookie.refreshToken.pathCookie,
            });
            if(process.env.DEVELOP === "true") console.log('refreshToken setCookie');
          
            res.status(200).json({//envoie du message
              accessTokenExpiresIn: config.token.accessToken.expiresIn,
              refreshTokenExpiresIn: config.token.refreshToken.expiresIn,
              xsrfToken,
            });
            if(process.env.DEVELOP === "true") console.log('Cookie et xsrf envoyé');

            next();
            
          })
          .catch(error => {//Pb avec la BDD
            if(process.env.DEVELOP === "true") console.log("updateOne nok");
            if(process.env.DEVELOP === "true") {
              console.log('erreur pour enregistrer le refreshToken');
              console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
              res.status(400).json({ error });
            } else {
              logger.error("Erreur MongoDB pour enregistrer refreshToken");
              console.log(process.env.MSG_ERROR_PRODUCTION);
              res.status(400).json({ message: process.env.MSG_ERROR_PRODUCTION });
            }
          });
      } else {
        if(process.env.DEVELOP === "true") console.log("id refreshToken non trouvé");
        
        const refresh = new RefreshToken({
          userId: user.id,
          refreshToken: refreshToken,
          expiresAt: Date.now() + config.token.refreshToken.expiresIn
        });
        if(process.env.DEVELOP === "true") console.log("refresh", refresh);
        
        refresh.save()
        //RefreshToken.findByIdAndUpdate({ userId: refresh.userId }, refresh)
          .then(() => {//enregistrement ok
            res.cookie('access_token', accessToken, {//config du cookie accessToken
              maxAge: config.token.accessToken.expiresIn,
              httpOnly: true,
              secure: true,
            });
            if(process.env.DEVELOP === "true") console.log('accessToken setCookie');
          
            res.cookie('refresh_token', refreshToken, {//config du cookie refreshToken
              maxAge: config.token.refreshToken.expiresIn,
              httpOnly: true,
              secure: true,
              path: config.cookie.refreshToken.pathCookie,
            });
            if(process.env.DEVELOP === "true") console.log('refreshToken setCookie');
          
            res.status(200).json({//envoie du message
              accessTokenExpiresIn: config.token.accessToken.expiresIn,
              refreshTokenExpiresIn: config.token.refreshToken.expiresIn,
              xsrfToken,
            });
            if(process.env.DEVELOP === "true") console.log('Cookie et xsrf envoyé');

            next();
            
          })
          .catch(error => {//Pb avec la BDD
            if(process.env.DEVELOP === "true") {
              console.log('erreur pour enregistrer le refreshToken');
              console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
              res.status(400).json({ error });
            } else {
              logger.error("Erreur MongoDB pour enregistrer refreshToken");
              console.log(process.env.MSG_ERROR_PRODUCTION);
              res.status(400).json({ message: process.env.MSG_ERROR_PRODUCTION });
            }
          });
      }
    })
    .catch(error => {//Pb avec la BDD
      if(process.env.DEVELOP === "true") {
        console.log("erreur BDD : pour trouver l'id du refreshToken");
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        res.status(400).json({ error });
      } else {
        logger.error("Erreur MongoDB pour enregistrer refreshToken");
        console.log(process.env.MSG_ERROR_PRODUCTION);
        res.status(400).json({ message: process.env.MSG_ERROR_PRODUCTION });
      }
    });
  
}

/////////////////////////////////////////////////////////////////////////////   Exports    //////////////////////////////////////////////////////////////////////////

exports.verify = (req, res, next) => {//vérification que l'email existe et validation de l'utilisateur
  if(process.env.DEVELOP === "true") console.log("fonction verify !");
  else logger.info("Requête verify lancée !");

  const { token } = req.params;
  const { refreshToken } = req.params;

  if(process.env.DEVELOP === "true") {
    console.log("token => "+token);
    console.log("refreshToken => "+refreshToken);
  }

  const user = User.findOne({ token: token.substr(1, token.length), refreshToken: refreshToken.substr(1, refreshToken.length) })
    .then(user => {
      if (!user) {//si utilisateur non trouvé
        if(process.env.DEVELOP === "true") {
          console.log("Utilisateur non trouvé");
          console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Email vérifié et non validé");
        
        return res.status(401).redirect("http://localhost:8080/login");
      }

      if(user.userConfirmed) {
        if(process.env.DEVELOP === "true") {
          console.log("Email déjà vérifié");
          console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Email déjà vérifié");

        return res.status(401).redirect("http://localhost:8080/login");//Si déjà confirmé
      }

      user.userConfirmed = true;
      user.token = crypto.randomBytes(128).toString('hex');//nouveau token par sécurité
      user.refreshToken = crypto.randomBytes(128).toString('hex');//nouveau token par sécurité

      user.save()
        .then(() => {
          if(process.env.DEVELOP === "true") {
            console.log("Email vérifié et validé");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
          } else logger.info("Email vérifié et validé");
          
          res.status(200).redirect("http://localhost:8080/login");

          //Envoyer email de confirmation
          mail.sendConfirmationEmail(user.email, result => {
            if(result){
              if(process.env.DEVELOP === "true") console.log("email de confirmation envoyé");
              else {
                logger.info("email de confirmation envoyé");
                console.log(process.env.MSG_OK_PRODUCTION);
              }

              next();
            } else {
              if(process.env.DEVELOP === "true") console.log("Erreur pour envoyé l'email de confirmation");
              else {
                logger.error("Erreur pour envoyé l'email de confirmation");
                console.log(process.env.MSG_ERROR_PRODUCTION);
              }
            }
          });
        })
        .catch(error => {
          if(process.env.DEVELOP === "true") {
            res.status(400).json({ error });
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
          } else {
            logger.error("Erreur MongoDB pour valider l'Email");
            console.log(process.env.MSG_ERROR_PRODUCTION);
          }

        });
    })
    .catch(error => {
      if(process.env.DEVELOP === "true") {
        console.log('erreur 500');
        res.status(500).json({ error });
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
      } else {
        logger.error("Erreur pour valider l'Email - recherche dans MongoDB impossible");
        console.log(process.env.MSG_ERROR_PRODUCTION);
      }
    });
};

exports.signup = (req, res, next) => {//Enregistrement du nouvel utilisateur
  if(process.env.DEVELOP === "true") console.log('Requete signup');
  else logger.info("Requête signup lancée !");

  if(process.env.DEVELOP === "true") {
    console.log('pwd => '+req.body.password);
    console.log('username => '+req.body.firstName);
    console.log('email => '+req.body.email);
  }

  //Utilisateur existant ?
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {//Si l'utilisateur existe, on stop la fonction
        if(process.env.DEVELOP === "true") {
          console.log("Utilisateur déjà existant !");
          console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
          res.status(401).json({ error: 'Utilisateur déjà existant !' });
        } else {
          logger.error("Utilisateur déjà existant !");
          res.status(401).json({ error: process.env.MSG_ERROR_PRODUCTION });
        }
      } else {
        bcrypt.hash(req.body.password, 10)
          .then(hash => {
            if(process.env.DEVELOP === "true") console.log('Hash du pwd');

            const userObject = req.body;
            delete userObject._id;

            const user = new User({
              email: req.body.email,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              password: hash,
              individu: req.body.individu,
              birthday: new Date(req.body.birthday),
              civilite: req.body.civilite,
              token: crypto.randomBytes(128).toString('hex'),
              refreshToken: crypto.randomBytes(128).toString('hex'),

            });

            //Envoie l'email
            if(process.env.DEVELOP === "true") console.log("Envoie de l'email");
            mail.sendVerifyEmail(user.email, user.token, user.refreshToken, (result) => {
              if(result)
                user.save()
                  .then(() => {
                    if(process.env.DEVELOP === "true") {
                      console.log("then user");
                      res.status(201).json({ message: 'Utilisateur créé !' });
                    } else {
                      res.status(201).json({ message: process.env.MSG_OK_PRODUCTION });
                      logger.info("Enregistrement du nouvelle utilisateur", user.email);
                    }

                    next();
                  })
                  .catch(error => {
                    if(process.env.DEVELOP === "true") {
                      console.log("catch user");
                      console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
                      res.status(400).json({ error });
                    } else {
                      console.log(process.env.MSG_ERROR_PRODUCTION);
                      logger.error("Erreur 400 d'enregistrement du nouvelle utilisateur", error.message);
                      res.status(400).json({ message: process.env.MSG_ERROR_PRODUCTION });
                    }
                  });
              else {
                if(process.env.DEVELOP === "true") {
                  console.log("pb mail");
                  console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
                  res.status(500).json({ message: "error 500, pb mail" });
                } else {
                  logger.error("Erreur 500 problème avec l'envoie du mail", error.message);
                  res.status(500).json({ message: process.env.MSG_ERROR_PRODUCTION });
                }
              }
            });
            
          })
          .catch(error => {
            if(process.env.DEVELOP === "true") {
              console.log('erreur 500');
              console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
              res.status(500).json({ error });
            } else {
              logger.error("Erreur 500 d'enregistrement du nouvelle utilisateur", error.message);
              res.status(500).json({ message: process.env.MSG_ERROR_PRODUCTION });
            }
          });
      }
    })
    .catch(error => {
      if(process.env.DEVELOP === "true") {
        res.status(500).json({ error });
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
      } else res.status(500).json({ error: process.env.MSG_ERROR_PRODUCTION });
    });

  
};

exports.login = (req, res, next) => {//connexion
  if(process.env.DEVELOP === "true") console.log('Requete login');
  else logger.info("requête login");
  /*
  console.log("user_serv => "+req.body.userName);
  console.log("pwd_serv => "+req.body.password);
  console.log("email_serv => "+req.body.email);
  /**/

  User.findOne({ email: req.body.email })
    .then(user => {
      if(!user){//Utilisateur non trouvé
        if(process.env.DEVELOP === "true") {
          console.log("Utilisateur non trouvé !");
          console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
          res.status(401).json({ error: 'Utilisateur non trouvé !' });
        } else {
          logger.error("Utilisateur non trouvé !");
          res.status(401).json({ error: process.env.MSG_ERROR_PRODUCTION });
        }
      } else {
        if(!user.userConfirmed){//utilisateur non validé
          if(process.env.DEVELOP === "true") {
            console.log("UserConfirmed", user.userConfirmed);
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
            return res.status(401).json({ error: 'Utilisateur pas encore confirmé dans la BDD !' });
          } else {
            logger.error("Utilisateur pas encore confirmé dans la BDD");
            return res.status(401).json({ error: process.env.MSG_ERROR_PRODUCTION });
          }
        } else {//si compte suspendu
          if(compteSuspendu(user)){
            if(process.env.DEVELOP === "true") {
              console.log("Compte suspendu");
              console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
              return res.status(401).json({ error: 'Compte suspendu' });
            }
            else {
              logger.error("Compte suspendu");
              return res.status(401).json({ error: process.env.MSG_ERROR_PRODUCTION });
            }
          } else {//si nombre de tentatives de connexion atteint
            if(user.tentativesConnexion >= config.login.MAX_CONNEXION){
              user.suspendu = moment().add(config.login.DELAI_AVANT_NOUVELLE_RECONNEXION, 's').toDate();
              //Remise à zéro du nombre de tentatives
              user.tentativesConnexion = 0;

              if(process.env.DEVELOP === "true") {
                console.log("user.suspendu", user.suspendu);
                console.log("config.login.DELAI_AVANT_NOUVELLE_RECONNEXION", config.login.DELAI_AVANT_NOUVELLE_RECONNEXION);
              }

              User.updateOne({ email: user.email }, user)
                .then(() => {
                  if(process.env.DEVELOP === "true") console.log("majDateSuspendu: enregistrée");
                  else logger.info("majDateSuspendu: enregistrée");
                  if(process.env.DEVELOP === "true") {
                    console.log("nombre de tentatives de connexion max atteint");
                    console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
                    return res.status(401).json({ error: 'nombre de tentatives de connexion max atteint' });
                  } else {
                    logger.error("nombre de tentatives de connexion max atteint");
                    return res.status(401).json({ error: process.env.MSG_ERROR_PRODUCTION });
                  }
                })
                .catch(error => {
                  if(process.env.DEVELOP === "true") {
                    console.log("Erreur 500: majDateSuspendu impossible");
                    console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
                    res.status(500).json({ error });
                  } else {
                    console.log(process.env.MSG_ERROR_PRODUCTION);
                    logger.error("Erreur 500: majDateSuspendu impossible", error.message);
                    res.status(500).json({ message: process.env.MSG_ERROR_PRODUCTION });
                  }
                });
              
            } else {//Tout est ok => connexion possible et envoie des tokens+cookies+...
              //Vérification du MDP
              bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                  if (!valid) {
                    if(process.env.DEVELOP === "true") {
                      console.log('Mot de passe incorrect !');
                    } else {
                      logger.error('Mot de passe incorrect !');
                    }
                    if(process.env.DEVELOP === "true") {
                      console.log("tentativesConnexion", user.tentativesConnexion);
                      console.log("email", user.email);
                    }
                    user.tentativesConnexion=user.tentativesConnexion+1;
                    if(process.env.DEVELOP === "true") console.log("tentativesConnexion", user.tentativesConnexion);
                    else logger.error('tentativesConnexion', user.tentativesConnexion);
                  
                    User.updateOne({ email: user.email }, user)
                      .then(() => {
                        if(process.env.DEVELOP === "true") console.log("addTentativeConnexion: ajouter 1 ok");
                        else logger.info("addTentativeConnexion: ajouter 1 ok");
                        if(process.env.DEVELOP === "true") {
                          console.log('Mot de passe incorrect !');
                          console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
                          res.status(401).json({ error: 'Mot de passe incorrect !' });
                        } else {
                          logger.error('Mot de passe incorrect !');
                          res.status(401).json({ error: process.env.MSG_ERROR_PRODUCTION });
                        }
                      })
                      .catch(error => {
                        if(process.env.DEVELOP === "true") {
                          console.log("Erreur 500: addTentativeConnexion impossible");
                          console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
                          res.status(500).json({ error });
                        } else {
                          console.log(process.env.MSG_ERROR_PRODUCTION);
                          logger.error("Erreur 500: addTentativeConnexion impossible", error.message);
                          res.status(500).json({ message: process.env.MSG_ERROR_PRODUCTION });
                        }
                      });
                  } else {
                    //Initialisation du nombre de tentatives de connexion
                    if(process.env.DEVELOP === "true") console.log("tentativesConnexion",user.tentativesConnexion);
                    user.tentativesConnexion=0;

                    User.updateOne({ email: user.email }, user)
                      .then(() => {
                        if(process.env.DEVELOP === "true") console.log("initNbreTentativeConnexion initialisé à 0");
                        else logger.info("initNbreTentativeConnexion initialisé à 0");

                        if(process.env.DEVELOP === "true") console.log("firstName", user.firstName);
                        envoieToken(user, res, next);
                      })
                      .catch(error => {
                        if(process.env.DEVELOP === "true") {
                          console.log("Erreur 500: initNbreTentativeConnexion initialisation impossible");
                          console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
                          res.status(500).json({ error });
                        } else {
                          console.log(process.env.MSG_ERROR_PRODUCTION);
                          logger.error("Erreur 500: initNbreTentativeConnexion initialisation impossible", error.message);
                          res.status(500).json({ message: process.env.MSG_ERROR_PRODUCTION });
                        }
                      });
                  }
                })
                .catch(error => {//MDP incorrect
                  if(process.env.DEVELOP === "true") {
                    console.log("Problème avec Bcrypt");
                    console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
                    res.status(500).json({ error });
                  } else {
                    console.log(process.env.MSG_ERROR_PRODUCTION);
                    logger.error("Erreur 500: Problème avec Bcrypt", error.message);
                    res.status(500).json({ message: process.env.MSG_ERROR_PRODUCTION });
                  }
                });
            }
          }
        }
      }
    })
    .catch(error => {
      if(process.env.DEVELOP === "true") {        
        console.log("Utilisateur non trouvé");
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        res.status(500).json({ error });
      } else {
        logger.error("Utilisateur non trouvé");
        res.status(500).json({ error: process.env.MSG_ERROR_PRODUCTION });
      }
    });
};

exports.logout = (req, res, next) => {//Déconnexion
  if(process.env.DEVELOP === "true") console.log('Requete login');
  else logger.info("requête login");

  //Dans la BDD refreshToken on modifie la date expiresAt à Date.now

  //côté client, on supprime xsrfToken et les cookies
};