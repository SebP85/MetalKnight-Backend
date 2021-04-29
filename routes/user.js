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

//Protection contre CSRF
const csrf = require("csurf");
var csrfProtection = csrf({ cookie: true });
var parseForm = express.urlencoded({
  extended: true
});
const csrfProtectionCtrl = require('../controllers/csrf');

//Routes connexion
//exemple: router.get('/register', /*parseForm,*/ csrfProtection, checkBody.validParamRegister, xssFilter.filterRegister, xml, objectifRoute);
router.get('/auth/register', csrfProtection, checkBody.validParamRegister, xssFilter.filterRegister, mail.checkEmail, userCtrl.signup);//=>post
router.get('/auth/verify/:token/:refreshToken', csrfProtection, checkBody.validParamVerify, xssFilter.filterVerify, userCtrl.verify);
router.get('/auth/login', csrfProtection, csrfProtectionCtrl.getToken, checkBody.validParamLogin, xssFilter.filterLogin, userCtrl.login);
router.get('/auth/logout', parseForm, csrfProtection, checkBody.validParamLogout, xssFilter.filterLogout, auth.normal, userCtrl.logout);
router.get('/auth/updateToken', parseForm, csrfProtection, checkBody.validParamUpdateToken, xssFilter.filterUpdateToken, auth.refreshToken, userCtrl.refreshToken);
router.get('/auth/updatePass', userCtrl.newPassword);//changement de mot de passe
router.get('/auth/mailPass', userCtrl.mailNewPassword);//mail pour changer de mot de passe

//Routes principales
//exemple: router.get('/register', /*parseForm,*/ csrfProtection, checkBody.validParamRegister, xssFilter.filterRegister, xml, auth.normal, role.levelAuthorize("free"), objectifRoute);
router.get('/getProfile', parseForm, csrfProtection, /*checkBody.validParamLogout, xssFilter.filterProfil, auth.normal, role.levelAuthorize("free"), objectifRoute*/);

module.exports = router;