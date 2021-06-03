/**
 * Transforme les messages avec des scripts
 */

 const { logger } = require('../log/winston');

var xss = require("xss");

exports.filterRegister = function (req, res, next) {//on transforme les données si danger
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

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

exports.filterVerify = function (req, res, next) {//on transforme les données si danger
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

    req.params.token = xss(req.params.token);
    req.params.refreshToken = xss(req.params.refreshToken);
    
    //console.log(req);
    next();
};

exports.filterLogin = function (req, res, next) {//on transforme les données si danger
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

    req.body.email = xss(req.body.email);
    req.body.password = xss(req.body.password);

    //req.body.csrf à faire ?
    
    //console.log(req);
    next();
};

exports.filterLogout = function (req, res, next) {//on transforme les données si danger
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

    req.headers.xsrfToken = xss(req.headers.xsrfToken);
    req.cookies.access_token = xss(req.cookies.access_token);

    //req.body.csrf à faire ?
    
    //console.log(req);
    next();
};

exports.filterUpdateToken = function (req, res, next) {//on transforme les données si danger
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

    req.headers.xsrfToken = xss(req.headers.xsrfToken);
    req.cookies.access_token = xss(req.cookies.access_token);
    req.headers.refresh_token = xss(req.headers.refresh_token);

    //req.body.csrf à faire ?
    
    //console.log(req);
    next();
};

exports.filterEmailNewMDP = function (req, res, next) {//on transforme les données si danger
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

    req.body.email = xss(req.body.email);
    
    //console.log(req);
    next();
};

exports.filterVerifMailNewMDP = function (req, res, next) {//on transforme les données si danger
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

    req.params.accessToken = xss(req.params.accessToken);
    req.params.refreshToken = xss(req.params.refreshToken);
    
    //console.log(req);
    next();
};

exports.filterUpdateMailNewMDP = function (req, res, next) {//on transforme les données si danger
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

    req.headers.xsrfToken = xss(req.headers.xsrfToken);
    req.cookies.access_token = xss(req.cookies.access_token);
    req.cookies.refresh_token = xss(req.cookies.refresh_token);

    req.body.email = xss(req.body.email);
    req.body.password = xss(req.body.password);

    //req.body.csrf à faire ?
    
    //console.log(req);
    next();
};

exports.filterMailNewMDP = function (req, res, next) {
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

    req.headers.xsrfToken = xss(req.headers.xsrfToken);
    req.cookies.access_token = xss(req.cookies.access_token);

    req.body.password = xss(req.body.password);

    //req.body.csrf à faire ?
    
    //console.log(req);
    next();
};

exports.filterGetProfile = function (req, res, next) {//on transforme les données si danger
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

    req.headers.xsrfToken = xss(req.headers.xsrfToken);
    req.cookies.access_token = xss(req.cookies.access_token);

    //req.body.csrf à faire ?
    
    //console.log(req);
    next();
};