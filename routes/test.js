const express = require('express');
const router = express.Router();
const testCtrl = require('../controllers/test');
const auth = require('../middleware/auth')
const mail = require("../controllers/mail")

const csrf = require("csurf");
var csrfProtection = csrf({ cookie: true });
var parseForm = express.urlencoded({
  extended: true
});
const csrfProtectionCtrl = require('../controllers/csrf');

router.get('/', mail.sendEmail);
router.get('/login', csrfProtection, csrfProtectionCtrl.getToken, testCtrl.login);
router.get('/getTest', parseForm, csrfProtection, csrfProtectionCtrl.checkToken, testCtrl.typeGet);//test route GET

module.exports = router;