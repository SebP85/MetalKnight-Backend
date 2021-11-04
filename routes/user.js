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
const coloc = require("../controllers/coloc");
const annonce = require("../controllers/annonce");

const multerAvatar = require("../middleware/multerAvatar");
const multerPhotosAnnonce = require("../middleware/multerPhotosAnnonce");
const path = require('path');

//Protection contre CSRF
/*const csrf = require("csurf");
var csrfProtection = csrf({ cookie: true });
var parseForm = express.urlencoded({
  extended: true
});*/
const csrfProtectionCtrl = require('../controllers/csrf');

//Routes connexion
//exemple: router.get('/register', checkBody.validParamAuth, checkBody.validParamRegister, xssFilter.filterRegister, xml, objectifRoute);
router.post('/auth/register', checkBody.validParamRegister, checkBody.validParamRecaptcha, xssFilter.filterRegister, xssFilter.filterRecaptcha, mail.checkEmail, userCtrl.verifyRecaptcha, userCtrl.signup);//=>post
router.get('/auth/verify/:token/:refreshToken', checkBody.validParamVerify, xssFilter.filterVerify, userCtrl.verify);
router.get('/auth/getCSRF', csrfProtectionCtrl.getTokenCSRF);
router.post('/auth/login', checkBody.validParamLogin, checkBody.validParamRecaptcha, xssFilter.filterLogin, xssFilter.filterRecaptcha, userCtrl.verifyRecaptcha, userCtrl.login);
router.post('/auth/logout', checkBody.validParamAuth, checkBody.validParamLogout, xssFilter.filterLogout, auth.normal, userCtrl.logout);
router.post('/auth/updateToken', checkBody.validParamAuthRefresh, checkBody.validParamUpdateToken, xssFilter.filterUpdateToken, auth.refreshToken, userCtrl.refreshToken);

router.post('/auth/mailNewPassword', checkBody.validParamEmailNewMDP, xssFilter.filterEmailNewMDP, userCtrl.mailNewPassword);//mail pour changer de mot de passe
router.get('/auth/verifMailNewMDP/:accessToken/:refreshToken', checkBody.validParamVerifMailNewMDP, xssFilter.filterVerifMailNewMDP, userCtrl.verifMailNewPassword);//Vérif mail pour changement du mot de passe et envoie vers la page pour changer de mot de passe
router.post('/auth/updateMailNewMDP', checkBody.validParamUpdateMailNewMDP, xssFilter.filterUpdateMailNewMDP, auth.mailNewPassword, userCtrl.UpdateMailNewPassword);//changement de mot de passe grâce au mail, envoie xsrfToken et cookie pour vérification
router.post('/auth/updateMDP', checkBody.validParamAuth, checkBody.validParamMailNewMDP, xssFilter.filterMailNewMDP, auth.normal, userCtrl.newPassword);//changement de mot de passe depuis le profil

//Routes principales
//exemple: router.get('/register', checkBody.validParamAuth, checkBody.validParamRegister, xssFilter.filterRegister, xml, auth.normal, role.levelAuthorize("free"), objectifRoute);
router.post('/getProfile', checkBody.validParamAuth, checkBody.validParamGetProfile, xssFilter.filterGetProfile, auth.normal, role.levelAuthorizeFree, profile.getProfile);
//router.post('/setProfile', checkBody.validParamAuth, checkBody.validParamSetProfile, xssFilter.filterSetProfile, auth.normal, role.levelAuthorizeFree, profile.setProfile);
router.post('/getZoneRecherche', checkBody.validParamAuth, checkBody.validParamGetZoneRecherche, xssFilter.filterGetZoneRecherche, auth.normal, role.levelAuthorizeFree, coloc.getZoneRecherche);
router.post('/setZoneRecherche', checkBody.validParamAuth, checkBody.validParamSetZoneRecherche, xssFilter.filterSetZoneRecherche, auth.normal, role.levelAuthorizeFree, coloc.setZoneRecherche);
router.post('/initZoneRecherche', checkBody.validParamAuth, xssFilter.filterInitZoneRecherche, auth.normal, role.levelAuthorizeFree, coloc.initZoneRecherche);

//Gestion de l'avatar
router.post('/getUrlAvatar', checkBody.validParamAuth, xssFilter.filterParamAuth, auth.normal, role.levelAuthorizeFree, coloc.getUrlAvatar);
router.post('/setAvatar', checkBody.validParamAuth, xssFilter.filterParamAuth, auth.normal, role.levelAuthorizeFree, coloc.suppAvatar, multerAvatar, coloc.setAvatar);
router.post('/getListeColocs', coloc.getListeColocs);

//Gestion des annonces
router.post('/addAnnonce', checkBody.validParamAuth, checkBody.validParamAddAnnonce, xssFilter.filterParamAuth, xssFilter.filterAddAnnonce, auth.normal, role.levelAuthorizeFree, annonce.addAnnonce);
router.post('/updateAnnonce', checkBody.validParamAuth, checkBody.validParamUpdateAnnonce, xssFilter.filterParamAuth, xssFilter.filterUpdateAnnonce, auth.normal, role.levelAuthorizeFree, annonce.updateAnnonce);
router.post('/addPhotoAnnonce', checkBody.validParamAuth, xssFilter.filterParamAuth, auth.normal, role.levelAuthorizeFree, multerPhotosAnnonce, checkBody.validParamRef, xssFilter.filterParamRef, annonce.addPhotoAnnonce);
router.post('/suppAnnonce', checkBody.validParamAuth, checkBody.validParamSuppAnnonce, xssFilter.filterParamAuth, xssFilter.filterSuppAnnonce, auth.normal, role.levelAuthorizeFree, annonce.suppAnnonce);
router.post('/suppOnePhotoAnnonce', checkBody.validParamAuth, xssFilter.filterParamAuth, checkBody.validParamSuppOnePhoto, xssFilter.filterParamSuppOnePhoto, auth.normal, role.levelAuthorizeFree, annonce.suppOnePhotoAnnonce);
router.post('/suppPhotosAnnonce', checkBody.validParamAuth, xssFilter.filterParamAuth, checkBody.validParamSuppPhotos, xssFilter.filterParamSuppPhotos, auth.normal, role.levelAuthorizeFree, annonce.suppPhotosAnnonce);
router.post('/getOneAnnonce', checkBody.validParamAuth, xssFilter.filterParamAuth, checkBody.validParamRef, xssFilter.filterParamRef, auth.normal, role.levelAuthorizeFree, annonce.getOneAnnonce);
router.post('/getAnnonces', annonce.getAnnonces);
router.post('/getMesAnnonces', checkBody.validParamAuth, xssFilter.filterParamAuth, auth.normal, role.levelAuthorizeFree, annonce.getMesAnnonces);

module.exports = router;//test