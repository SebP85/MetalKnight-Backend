/**
 * Listing
 * 
 * 1-Valider CSRF
 * 2-Valider données d'entrée (noSQL, SQL, pas de script, regex, redos attack, ...)
 * 3-filtrer xss
 * 4-filtrer xml (si besoin)
 * 5-décryptage données d'entrée (cookie+JWT+API key+formulaire envoyé) et authentification et role
 * 6-objectif de la route
 * 
 * 7-installer sqreen pour se protéger des attaques
 * 
 * attaque ddos = beaucoup de requêtes pour down le serveur
 * brute force pour passer le mot de passe (bloquer l'adresse IP après x tentative + MDP avec 8 carac/symbole/majuscule + captcha=image + double identification)
 */

const config = require('../config/config')
const { logger } = require('../log/winston');

const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const mail = require("../controllers/mail");
const xssFilter = require("../controllers/xssFilter");
const checkBody = require("../controllers/checkBody");
const userCtrl = require("../controllers/user");
const role = require("../controllers/role");

const profile = require("../controllers/profile");

//Protection contre CSRF
/*const csrf = require("csurf");
var csrfProtection = csrf({ cookie: true });
var parseForm = express.urlencoded({
  extended: true
});*/
const csrfProtectionCtrl = require('../controllers/csrf');

//Routes connexion
//exemple: router.get('/register', /*parseForm,*/ csrfProtection, checkBody.validParamRegister, xssFilter.filterRegister, xml, objectifRoute);
router.post('/auth/register', /*csrfProtection,*/ checkBody.validParamRegister, xssFilter.filterRegister, mail.checkEmail, userCtrl.signup);//=>post
router.get('/auth/verify/:token/:refreshToken', /*csrfProtection,*/ checkBody.validParamVerify, xssFilter.filterVerify, userCtrl.verify);
router.get('/auth/getCSRF', /*csrfProtection,*/ csrfProtectionCtrl.getTokenCSRF);
router.post('/auth/login', /*parseForm, csrfProtection,*/ checkBody.validParamLogin, xssFilter.filterLogin, userCtrl.login);
router.post('/auth/logout', /*parseForm, csrfProtection,*/ checkBody.validParamLogout, xssFilter.filterLogout, auth.normal, userCtrl.logout);
router.get('/auth/updateToken', /*parseForm, csrfProtection,*/ checkBody.validParamUpdateToken, xssFilter.filterUpdateToken, auth.refreshToken, userCtrl.refreshToken);

router.get('/auth/mailNewPassword', /*csrfProtection,*/ checkBody.validParamEmailNewMDP, xssFilter.filterEmailNewMDP, userCtrl.mailNewPassword);//mail pour changer de mot de passe
router.get('/auth/verifMailNewMDP/:accessToken/:refreshToken', /*csrfProtection,*/ checkBody.validParamVerifMailNewMDP, xssFilter.filterVerifMailNewMDP, userCtrl.verifMailNewPassword);//Vérif mail pour changement du mot de passe et envoie vers la page pour changer de mot de passe
router.get('/auth/updateMailNewMDP', /*parseForm, csrfProtection,*/ checkBody.validParamUpdateMailNewMDP, xssFilter.filterUpdateMailNewMDP, auth.mailNewPassword, userCtrl.UpdateMailNewPassword);//changement de mot de passe grâce au mail, envoie xsrfToken et cookie pour vérification
router.get('/auth/updateMDP', /*parseForm, csrfProtection,*/ checkBody.validParamMailNewMDP, xssFilter.filterMailNewMDP, auth.normal, userCtrl.newPassword);//changement de mot de passe depuis le profil

//Routes principales
//exemple: router.get('/register', /*parseForm,*/ csrfProtection, checkBody.validParamRegister, xssFilter.filterRegister, xml, auth.normal, role.levelAuthorize("free"), objectifRoute);
router.post('/getProfile', /*parseForm, csrfProtection,*/ checkBody.validParamGetProfile, xssFilter.filterGetProfile, auth.normal, role.levelAuthorizeFree, profile.getProfile);

module.exports = router;//test