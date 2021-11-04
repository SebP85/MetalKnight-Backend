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

exports.filterAddAnnonce = function (req, res, next) {
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
    req.body.meuble = xss(req.body.meuble);

    req.body.laveVaisselle = xss(req.body.laveVaisselle);
    req.body.wifi = xss(req.body.wifi);
    req.body.cuisineEquipe = xss(req.body.cuisineEquipe);
    req.body.television = xss(req.body.television);
    req.body.laveLinge = xss(req.body.laveLinge);
    req.body.chemine = xss(req.body.chemine);
    req.body.radElec = xss(req.body.radElec);
    req.body.chGaz = xss(req.body.chGaz);
    req.body.poele = xss(req.body.poele);
    req.body.detecFumee = xss(req.body.detecFumee);
    req.body.baignoire = xss(req.body.baignoire);
    req.body.sdbPriv = xss(req.body.sdbPriv);
    req.body.secheCheveux = xss(req.body.secheCheveux);
    req.body.linge = xss(req.body.linge);
    req.body.couvEtUstensiles = xss(req.body.couvEtUstensiles);
    req.body.ferRepasser = xss(req.body.ferRepasser);
    req.body.tancarville = xss(req.body.tancarville);
    req.body.dressing = xss(req.body.dressing);
    req.body.verrouCh = xss(req.body.verrouCh);
    req.body.refri = xss(req.body.refri);
    req.body.fourMicro = xss(req.body.fourMicro);
    req.body.equipCuisine = xss(req.body.equipCuisine);
    req.body.congelo = xss(req.body.congelo);
    req.body.four = xss(req.body.four);
    req.body.cafetiere = xss(req.body.cafetiere);
    req.body.barbecue = xss(req.body.barbecue);
    req.body.mobilierExt = xss(req.body.mobilierExt);
    req.body.camExt = xss(req.body.camExt);
    req.body.femmeDeMenage = xss(req.body.femmeDeMenage);
    req.body.gardien = xss(req.body.gardien);
    req.body.rangements = xss(req.body.rangements);
    req.body.bureau = xss(req.body.bureau);

    next();
};

exports.filterUpdateAnnonce = function (req, res, next) {
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

    req.body.ref = xss(req.body.ref);
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
    req.body.meuble = xss(req.body.meuble);

    req.body.laveVaisselle = xss(req.body.laveVaisselle);
    req.body.wifi = xss(req.body.wifi);
    req.body.cuisineEquipe = xss(req.body.cuisineEquipe);
    req.body.television = xss(req.body.television);
    req.body.laveLinge = xss(req.body.laveLinge);
    req.body.chemine = xss(req.body.chemine);
    req.body.radElec = xss(req.body.radElec);
    req.body.chGaz = xss(req.body.chGaz);
    req.body.poele = xss(req.body.poele);
    req.body.detecFumee = xss(req.body.detecFumee);
    req.body.baignoire = xss(req.body.baignoire);
    req.body.sdbPriv = xss(req.body.sdbPriv);
    req.body.secheCheveux = xss(req.body.secheCheveux);
    req.body.linge = xss(req.body.linge);
    req.body.couvEtUstensiles = xss(req.body.couvEtUstensiles);
    req.body.ferRepasser = xss(req.body.ferRepasser);
    req.body.tancarville = xss(req.body.tancarville);
    req.body.dressing = xss(req.body.dressing);
    req.body.verrouCh = xss(req.body.verrouCh);
    req.body.refri = xss(req.body.refri);
    req.body.fourMicro = xss(req.body.fourMicro);
    req.body.equipCuisine = xss(req.body.equipCuisine);
    req.body.congelo = xss(req.body.congelo);
    req.body.four = xss(req.body.four);
    req.body.cafetiere = xss(req.body.cafetiere);
    req.body.barbecue = xss(req.body.barbecue);
    req.body.mobilierExt = xss(req.body.mobilierExt);
    req.body.camExt = xss(req.body.camExt);
    req.body.femmeDeMenage = xss(req.body.femmeDeMenage);
    req.body.gardien = xss(req.body.gardien);
    req.body.rangements = xss(req.body.rangements);
    req.body.bureau = xss(req.body.bureau);

    next();
};

exports.filterSuppAnnonce = function (req, res, next) {
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

    req.body.ref = xss(req.body.ref);

    next();
};

exports.filterParamRef = function (req, res, next) {
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

    req.body.ref = xss(req.body.ref);

    next();
};

exports.filterParamSuppOnePhoto = function (req, res, next) {
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

    req.body.urlPhoto = xss(req.body.urlPhoto);

    next();
};

exports.filterParamSuppPhotos = function (req, res, next) {
    if(process.env.DEVELOP === "true") console.log("fonction xss");
    else logger.info('Traitement contre XSS attack');

    for(const index in req.body.photos)
        req.body.photos[index] = xss(req.body.photos[index]);
    
    req.body.ref = xss(req.body.ref);

    next();
};