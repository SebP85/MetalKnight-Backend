/**
 * Transforme les messages avec des scripts
 */

var xss = require("xss");

exports.filterRegister = function (req, res, next) {//on transforme les données si danger
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    if(process.env.DEVELOP === "false") logger.info('Traitement contre XSS attack');

    req.body.email = xss(req.body.email);
    req.body.password = xss(req.body.password);
    req.body.individu = xss(req.body.individu);
    req.body.firstName = xss(req.body.firstName);
    req.body.lastName = xss(req.body.lastName);
    req.body.birthday = xss(req.body.birthday);
    req.body.civilite = xss(req.body.civilite);
    
    //console.log(req);
    next();
};