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
    //req.cookies.access_token = xss(req.cookies.access_token);
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

    //req.body.email = xss(req.body.email);
    req.body.password = xss(req.body.password);
    req.body.passwordConfirm = xss(req.body.passwordConfirm);

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
    req.body.newPassword = xss(req.body.newPassword);

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

exports.filterRecaptcha = function (req, res, next) {//filtre le token recaptcha
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

    req.body.tokenRecaptcha = xss(req.body.tokenRecaptcha);

    //req.body.csrf à faire ?
    
    //console.log(req);
    next();
}

exports.filterSetZoneRecherche = function (req, res, next) {//filtre le token recaptcha
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

    req.body.lieu = xss(req.body.lieu);
    req.body.distance = xss(req.body.distance);
    req.body.budget = xss(req.body.budget);
    req.body.commentaire = xss(req.body.commentaire);
    req.body.tel = xss(req.body.tel);
    req.body.age = xss(req.body.age);
    req.body.situation = xss(req.body.situation);
    req.body.rechercheActive = xss(req.body.rechercheActive);

    next();
}

exports.filterGetZoneRecherche = function (req, res, next) {//on transforme les données si danger
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

    req.headers.xsrfToken = xss(req.headers.xsrfToken);
    req.cookies.access_token = xss(req.cookies.access_token);

    //req.body.csrf à faire ?
    
    //console.log(req);
    next();
};

exports.filterInitZoneRecherche = function (req, res, next) {//on transforme les données si danger
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

    req.headers.xsrfToken = xss(req.headers.xsrfToken);
    req.cookies.access_token = xss(req.cookies.access_token);

    //req.body.csrf à faire ?
    
    //console.log(req);
    next();
};

exports.filterParamAuth = function (req, res, next) {//on transforme les données si danger
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

    req.headers.xsrfToken = xss(req.headers.xsrfToken);
    req.cookies.access_token = xss(req.cookies.access_token);

    //req.body.csrf à faire ?
    
    //console.log(req);
    next();
};

exports.filterSetAnnonce = function (req, res, next) {
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

    req.body.lieu = xss(req.body.lieu);
    req.body.loyerHC = xss(req.body.loyerHC);
    req.body.charges = xss(req.body.charges);
    req.body.type = xss(req.body.type);
    req.body.description = xss(req.body.description);
    req.body.nbreColocataire = xss(req.body.nbreColocataire);
    req.body.nbreColocOccupants = xss(req.body.nbreColocOccupants);
    req.body.mail = xss(req.body.mail);
    req.body.tel = xss(req.body.tel);
    req.body.titreAnnonce = xss(req.body.titreAnnonce);
    req.body.surface = xss(req.body.surface);
    req.body.nbrePieces = xss(req.body.nbrePieces);
    req.body.classEnergie = xss(req.body.classEnergie);
    req.body.ges = xss(req.body.ges);
    req.body.masquerNumero = xss(req.body.masquerNumero);
    req.body.refuseDemarcheCommercial = xss(req.body.refuseDemarcheCommercial);
    req.body.datePoster = xss(req.body.datePoster);
    req.body.annonceActive = xss(req.body.annonceActive);
    req.body.annonceValide = xss(req.body.annonceValide);

    next();
};