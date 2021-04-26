const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const config = require('../config/config');
const crypto = require('crypto');
const mail = require("../controllers/mail");
const { logger } = require('../log/winston');

exports.verify = (req, res, next) => {//vérification que l'email existe et validation de l'utilisateur
  if(process.env.DEVELOP === "true") console.log("fonction verify !");
  else logger.info("Requête verify lancée !");

  const { token } = req.params;
  const { refreshToken } = req.params;

  if(process.env.DEVELOP === "true") {
    //console.log("token => "+token);
    //console.log("refreshToken => "+refreshToken);
  }

  const user = User.findOne({ token: token.substr(1, token.length), refreshToken: refreshToken.substr(1, refreshToken.length) })
    .then(user => {
      if (!user) {//si utilisateur non trouvé
        logger.error("Email vérifié et non validé");
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        return res.status(401).redirect("http://localhost:8080/login");
      }

      if(user.userConfirmed) {
        logger.error("Email déjà vérifié");
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        return res.status(401).redirect("http://localhost:8080/login");//Si déjà confirmé
      }

      user.userConfirmed = true;
      user.token = crypto.randomBytes(128).toString('hex');//nouveau token par sécurité
      user.refreshToken = crypto.randomBytes(128).toString('hex');//nouveau token par sécurité

      user.save()
        .then(() => {
          logger.info("Email vérifié et validé");
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
                res.status(400).json({ error });
                console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
              } else {
                console.log(process.env.MSG_ERROR_PRODUCTION);
                logger.error("Erreur 400 d'enregistrement du nouvelle utilisateur", error.message);
              }
            });
        else {
          if(process.env.DEVELOP === "true") {
            res.status(500).json({ message: "error 500, pb mail" });
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
          } else {
            res.status(500).json({ message: process.env.MSG_ERROR_PRODUCTION });
            logger.error("Erreur 500 problème avec l'envoie du mail", error.message);
          }
        }
      });
      
    })
    .catch(error => {
      if(process.env.DEVELOP === "true") {
        console.log('erreur 500');
        res.status(500).json({ error });
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
      } else {
        res.status(500).json({ message: process.env.MSG_ERROR_PRODUCTION });
        logger.error("Erreur 500 d'enregistrement du nouvelle utilisateur", error.message);
      }
    });

    console.log("fin fonction signup");
};

/*exports.login = (req, res, next) => { //  ===> ajouter refreshToken
  if(process.env.DEVELOP === "true") console.log('Requete login');
  /*
  console.log("user_serv => "+req.body.userName);
  console.log("pwd_serv => "+req.body.password);
  console.log("email_serv => "+req.body.email);
  /**/

  /*User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        if(process.env.DEVELOP === "true") return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        else return res.status(401).json({ error: process.env.MSG_ERROR_PRODUCTION });
      }/* else {
        console.log("email trouvé");
      }*/
      /*bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if(process.env.DEVELOP === "true") console.log('envoie token');
          if (!valid) {
            if(process.env.DEVELOP === "true") return res.status(401).json({ error: 'Mot de passe incorrect !' });
            else return res.status(401).json({ error: process.env.MSG_ERROR_PRODUCTION });
          }

          /* 7. On créer le refresh token et on le stocke en BDD */
          /*const refreshToken = crypto.randomBytes(128).toString('base64');
      
          /*await RefreshToken.create({
            userId: user.id,
            token: refreshToken,
            expiresAt: Date.now() + config.refreshToken.expiresIn
          });*/

          /*if(process.env.DEVELOP === "true") console.log('refreshToken => '+refreshToken);

          res.cookie('test', refreshToken, {
            maxAge: config.token.refreshToken.expiresIn,
            httpOnly: true,
            secure: true,
            path: '/',
          });

          res.cookie('cookie2', "_ceci_est_mon_deuxieme_cookie", {
            maxAge: config.token.refreshToken.expiresIn,
            httpOnly: true,
            secure: true,
            path: '/',
          });

          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id, userName: user.userName },
              config.token.accessToken.secret,
              {
                algorithm: config.token.accessToken.algorithm,
                audience: config.token.accessToken.audience,
                expiresIn: config.token.accessToken.expiresIn / 1000,
                issuer: config.token.accessToken.issuer,
                subject: user.id.toString()
              }
            ),
            tokenRefresh: refreshToken,
            expiresAt: new Date(Date.now() + config.token.refreshToken.expiresIn)
          });
          //console.log('token envoyé');
        })
        .catch(error => {
          if(process.env.DEVELOP === "true") {
            res.status(500).json({ error });
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
          } else res.status(500).json({ error: process.env.MSG_ERROR_PRODUCTION });
        });
    })
    .catch(error => {
      if(process.env.DEVELOP === "true") {
        res.status(500).json({ error });
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
      } else res.status(500).json({ error: process.env.MSG_ERROR_PRODUCTION });
    });
};*/

/*exports.codeVerification = (req, res, next) => {//vérification par email de l'utilisateur
  if(process.env.DEVELOP === "true") console.log('Requete codeVerification');
  else logger.info("Requête codeVerification lancée !");

  //console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');

};*/

exports.nbreTentative = (req, res, next) => {//Vérifie le nombre de tentative lors de la connexion (limité à 5)
  if(process.env.DEVELOP === "true") console.log('Requete nbreTentative');
  else logger.info("Requête nbreTentative lancée !");

  //console.log(req);
  //console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
  
};