/**
 * Listing
 * 
 * 1-Valider CSRF
 * 2-Valider données d'entrée (noSQL, SQL, pas de script, regex, redos attack, ...)
 * 3-filtrer xss
 * 4-filtrer xml (si besoin)
 * 5-décryptage données d'entrée (cookie+JWT+API key+formulaire envoyé) et authentification
 * 6-objectif de la route
 */

const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const mail = require("../controllers/mail");
const xssFilter = require("../controllers/xssFilter");
const checkBody = require("../controllers/checkBody");

//exemple
//const userCtrl = require('../controllers/user');
//const testCtrl = require('../controllers/test');

//Protection contre CSRF
const csrf = require("csurf");
var csrfProtection = csrf({ cookie: true });
var parseForm = express.urlencoded({
  extended: true
});
const csrfProtectionCtrl = require('../controllers/csrf');

//Routes connexion
router.get('/register', csrfProtection, checkBody.validParamRegister, xssFilter.filterRegister, /*xml,*/ /*objectifRoute*/);
router.get('/verify/:token/:refreshToken', csrfProtection, checkBody.reqValidation, xssFilter.filterRegister, /*xml,*/ /*objectifRoute*/);
router.get('/login', /*parseForm,*/ csrfProtection, csrfProtectionCtrl.getToken, checkBody.reqValidation, xssFilter.filterRegister, /*xml,*/ auth/*, objectifRoute*/);

//Routes principales
router.get('/', );

router.get('/getProfile', parseForm, csrfProtection, csrfProtectionCtrl.checkToken, );

module.exports = router;