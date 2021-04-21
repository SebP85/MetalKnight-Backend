const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

const csrf = require("csurf");
var csrfProtection = csrf({ cookie: true });
var parseForm = express.urlencoded({
  extended: true
});
const csrfProtectionCtrl = require('../controllers/csrf');


router.post('/signup', userCtrl.signup);
router.post('/login', csrfProtection, csrfProtectionCtrl.getToken, userCtrl.login);//get ?
router.post('/login/codeVerification', userCtrl.codeVerification);//vérification de l'utilisateur par un code envoyé par email
router.get('/verify/:token/:refreshToken', userCtrl.verify);//Vérification que l'email existe

module.exports = router;

//manque logout => refresh JWT