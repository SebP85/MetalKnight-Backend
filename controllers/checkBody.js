/**
 * Vérifie les données d'entrées de la requête
 */
 const { logger } = require('../log/winston');
 const config = require('../config/config');

//const { body, validationResult, oneOf } = require('express-validator');//valide les paramètres avec des fonctions préprogrammées
const v8n = require('v8n');//valide les paramètres d'entrées et peutajouter des fonctions chainés
const { isBoolean } = require('util');
//voir https://imbrn.github.io/v8n/#what-s-v8n et https://github.com/imbrn/v8n/tree/master/src et https://imbrn.github.io/v8n/api/#testasync
const chatty = false;

function isEmail(val){
    var v = v8n()
        .string()
        .not.null()
        .minLength(5)
        .maxLength(55)
        .some.equal('@')
        .some.equal('.')
        .test(val);

    if(chatty) console.log("email", v);
    if(!v && process.env.DEVELOP === "false") logger.error("Email =>", val);

    return v;
}

function isStrongPassword(val){//Caractère spéciaux => %@_$|#?!
    var v = v8n()
        .string()
        .not.null()
        .minLength(8)
        .maxLength(55)
        .some.lowercase()
        .some.uppercase()
        .some.numeric()
        .pattern(/[&~`!@#$%\^*()\-_=+[\];:\x27.,\x22\\|/?]/)//doit avoir un des caractères acceptés entre [], ne peut pas être /[]
        .not.includes('}')//caractère spéciaux interdits
        .not.includes('{')
        .not.includes('>')
        .not.includes('<')
        .test(val);

    if(chatty) console.log("password", v);
    if(!v && process.env.DEVELOP === "false") logger.error("Password =>", val);

    return v;
}

function isIndividu(val){
    var v = v8n()
        .string()
        .passesAnyOf(v8n().exact("un particulier"), v8n().exact("un professionnel"))
        .test(val);

    if(chatty) console.log("individu", v);
    if(!v && process.env.DEVELOP === "false") logger.error("Individu =>", val);

    return v;
}

function isFirstName(val){
    var v = v8n()
        .string()
        .minLength(2)
        .pattern(/^[a-zA-Zéêèàù'ùëäâ]+$/)//autorisé
        .pattern(/^[^0-9.;,?:!§%*µ$£ø^¨"~&{()}|_`@=+-<>]+$/)//interdit
        .test(val);

    if(chatty) console.log("firstName", v);
    if(!v && process.env.DEVELOP === "false") logger.error("firstName =>", val);

    return v;
}

function isLastName(val){
    var v = v8n()
        .string()
        .minLength(2)
        .pattern(/^[a-zA-Zéêèàù'ùëäâ]+$/)//autorisé
        .pattern(/^[^0-9.;,?:!§%*µ$£ø^¨"~&{()}|_`@=+-<>]+$/)//interdit
        .test(val);

    if(chatty) console.log("lastName", v);
    if(!v && process.env.DEVELOP === "false") logger.error("lastName =>", val);

    return v;
}

function isDate(val){//type => mm/jj/aaaa
    var v = v8n()
        .pattern(/^[0-9\/]+$/)//autorisé
        //.pattern(/^\d{2}\/\d{2}\/\d{4}$/)
        .pattern(/^((((0[13578])|([13578])|(1[02]))[\/](([1-9])|([0-2][0-9])|(3[01])))|(((0[469])|([469])|(11))[\/](([1-9])|([0-2][0-9])|(30)))|((2|02)[\/](([1-9])|([0-2][0-9]))))[\/]\d{4}$|^\d{4}$/)//dd/mm/yyyy
        //.pattern(/^((((19|[2-9]\d)\d{2})\-(0[13578]|1[02])\-(0[1-9]|[12]\d|3[01]))|(((19|[2-9]\d)\d{2})\-(0[13456789]|1[012])\-(0[1-9]|[12]\d|30))|(((19|[2-9]\d)\d{2})\-02\-(0[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))\-02\-29))$/)
        //.length(10)
        .test(val);

    if(chatty) console.log("date", v);
    if(!v && process.env.DEVELOP === "false") logger.error("date =>", val);

    return v;
}

function isCivilite(val){
    var v = v8n()
        .string()
        .passesAnyOf(v8n().exact("monsieur"), v8n().exact("madame"))
        .test(val);

    if(chatty) console.log("civilite", v);
    if(!v && process.env.DEVELOP === "false") logger.error("civilite =>", val);

    return v;
}

function isTokenHex(val){
    var v = v8n()
        .string()
        .not.null()
        .length(257)
        .pattern(/^[a-f0-9:]+$/)//autorisé
        .test(val);

    if(chatty) console.log("token/refreshToken", v);
    if(!v && process.env.DEVELOP === "false") logger.error("token/refreshToken =>", val);

    return v;
}

function isXSRFToken(val){
    var v = v8n()
        .string()
        .not.null()
        .length(256)
        .pattern(/^[a-zA-Z0-9]+$/)//autorisé
        .test(val);

    if(chatty) console.log("xsrfToken", v);
    if(!v && process.env.DEVELOP === "false") logger.error("xsrfToken =>", val);

    return v;
}

function isTokenJWTaccess(val){
    //console.log("jwt =>", val);

    var v = v8n()
        .string()
        .not.null()
        //.length(632)
        .pattern(/^[a-zA-Z0-9._-]+$/)//autorisé
        .test(val);

    if(chatty) console.log("jwtAccessToken", v);
    if(!v && process.env.DEVELOP === "false") logger.error("jwtAccessToken =>", val);

    return v;
}

function isTokenJWTrefresh(val){
    //console.log("jwt =>", val);

    var v = v8n()
        .string()
        .not.null()
        //.length(880)
        .pattern(/^[a-zA-Z0-9._-]+$/)//autorisé
        .test(val);

    if(chatty) console.log("jwtRefreshToken", v);
    if(!v && process.env.DEVELOP === "false") logger.error("jwtRefreshToken =>", val);

    return v;
}

function isTokenBase64(val){
    var v = v8n()
        .string()
        .not.null()
        .length(256)
        .pattern(/^[a-zA-Z0-9]+$/)//autorisé
        .test(val);

    if(chatty) console.log("Base64Token", v);
    if(!v && process.env.DEVELOP === "false") logger.error("Base64Token =>", val);

    return v;
}

function isRecaptcha(val){
    var v = v8n()
        .string()
        .not.null()
        //.length(462)
        .pattern(/^[a-zA-Z0-9_-]+$/)//autorisé
        .test(val);

    if(chatty) console.log("Recaptcha", val, v);
    if(!v && process.env.DEVELOP === "false") logger.error("Recaptcha =>", val);

    return v;
}

function isLieu(val){
    var v = v8n()
        .string()
        .not.null()
        .minLength(2)
        .pattern(/^[-a-zA-Zéêèàù'ùëäâ ]+$/)//autorisé
        .pattern(/^[^0-9.;,?:!§%*µ$£ø^¨"~&{()}|_`@=+<>]+$/)//interdit
        .test(val);

    if(chatty) console.log("Lieu", v);
    if(!v && process.env.DEVELOP === "false") logger.error("Lieu =>", val);

    return v;
}

function isCommentaire(val){
    var v = false;

    if(!v8n().string().exact("").test(val)){
    v = v8n()
        .string()
        .maxLength(255)
        .pattern(/^[^@<>§;_&\\=+]+$/)//interdit
        .test(val);
    } else {
        v = true;
    }

    if(chatty) console.log("Commentaire", v);
    if(!v && process.env.DEVELOP === "false") logger.error("Commentaire =>", val);

    return v;
}

function isDescription(val){
    var v = false;

    v = v8n()
        .string()
        .maxLength(1500)
        .minLength(20)
        .pattern(/^[^@<>§;_&\\=+]+$/)//interdit
        .test(val);

    if(chatty) console.log("Description", v);
    if(!v && process.env.DEVELOP === "false") logger.error("Description =>", val);

    return v;
}

function isTel(val){
    var v = false;

    if(!v8n().string().exact("").test(val)){
        var v = v8n()
            .string()
            .maxLength(17)
            .pattern(/^([+]|[0])[0-9 .]{0,16}$/)//trame autorisé
            .test(val);
    } else {
        v = true;
    }

    if(chatty) console.log("Tel", v);
    if(!v && process.env.DEVELOP === "false") logger.error("Tel =>", val);

    return v;
}

function isNumber(val, min, max){
    var v = v8n()
        .numeric()
        .between(min, max)
        .test(val);

    if(chatty) console.log("Nombre", v);
    if(!v && process.env.DEVELOP === "false") logger.error("Nombre =>", val);

    return v;
}

function isBool(val){
    var v = v8n()
        .boolean()
        .not.null()
        .test(val);

    if(chatty) console.log("Boolean", v);
    if(!v && process.env.DEVELOP === "false") logger.error("Boolean =>", val);

    return v;
}

function isSituation(val){
    var v = v8n()
        .string()
        .not.null()
        .passesAnyOf(v8n().exact("etudiant"), v8n().exact("alternance"), v8n().exact("chomage"), v8n().exact("embauche"))
        .test(val);

    if(chatty) console.log("civilite", v);
    if(!v && process.env.DEVELOP === "false") logger.error("civilite =>", val);

    return v;
}

function isNumberDate(val){
    var v = v8n()
        .numeric()
        .test(val);

    if(chatty) console.log("Number Date", v);
    if(!v && process.env.DEVELOP === "false") logger.error("Number Date =>", val);

    return v;
}

function isType(val){
    var v = v8n()
        .string()
        .not.null()
        .passesAnyOf(v8n().exact("Appartement"), v8n().exact("Maison"), v8n().exact("Bungalow"))
        .test(val);

    if(chatty) console.log("type", v);
    if(!v && process.env.DEVELOP === "false") logger.error("type =>", val);

    return v;
}

function isTitreAnnonce(val){
    var v = v8n()
        .string()
        .not.null()
        .maxLength(255)
        .pattern(/^[-a-z0-9A-Zéêèàù'ùëäâ?!° ]+$/)//autorisé
        .pattern(/^[^.;,:§%*µ$£ø^¨"~&{()}|_`@=+<>]+$/)//interdit
        .test(val);

    if(chatty) console.log("Titre annonce", v);
    if(!v && process.env.DEVELOP === "false") logger.error("Titre annonce =>", val);

    return v;
}

function isClassEnergie(val){
    var v = v8n()
        .string()
        .not.null()
        .passesAnyOf(v8n().exact("Vierge"), v8n().exact("A"), v8n().exact("B"), v8n().exact("C"),
            v8n().exact("D"), v8n().exact("E"), v8n().exact("F"), v8n().exact("G"))
        .test(val);

    if(chatty) console.log("Catégorie énergie", v);
    if(!v && process.env.DEVELOP === "false") logger.error("Catégorie énergie =>", val);

    return v;
}

function isRef(val){
    var v = v8n()
        .string()
        .not.null()
        .length(24)
        .pattern(/^[a-z0-9]+$/)//interdit
        .test(val);

    if(chatty)
    console.log("Ref", val);
    if(!val && process.env.DEVELOP === "false") logger.error("Ref =>", val);

    return v;
}

function isUrlAnnonces(val){
    var v = v8n()
        .string()
        .not.null()
        .first("h")
        .includes("https://")
        .includes("/Images/Annonces/")
        .pattern(/[a-z0-9A-Z_.:\/]+$/)//autorisé
        .test(val);

    if(chatty) console.log("UrlAnnonces", val);
    if(!val && process.env.DEVELOP === "false") logger.error("UrlAnnonces =>", val);

    return v;
}

function isUrlPhotos(photos){
    var verifPhotos = true;
    for(const urlPhoto of photos){
        if(!v8n()
            .string()
            .not.null()
            .first("h")
            .includes("https://")
            .includes("/Images/Annonces/")
            .pattern(/[a-z0-9A-Z_.:\/]+$/)//autorisé
            .test(urlPhoto)){
                verifPhotos = false;
                //console.log("urlPhoto nok", urlPhoto)
                break;
            }
    }

    if(chatty) console.log("UrlPhotos", photos);
    if(!photos && process.env.DEVELOP === "false") logger.error("UrlPhotos =>", photos);

    return verifPhotos;
}

exports.validParamRegister = function (req, res, next){
    if(process.env.DEVELOP === "true") console.log("checkBody");
    else logger.info("Vérification des données d'entrées");

    //v8n
    if(isEmail(req.body.email) && isStrongPassword(req.body.password) && isIndividu(req.body.individu) &&
        isFirstName(req.body.firstName) && isLastName(req.body.lastName) && isDate(req.body.birthday) &&
            isCivilite(req.body.civilite)){
        if(process.env.DEVELOP === "true") console.log("Données d'entrées ok");
        else logger.info("Données d'entrées ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données d'entrées nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données d'entrées nok");
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

exports.validParamVerify = function (req, res, next){
    if(process.env.DEVELOP === "true") console.log("checkBody");
    else logger.info("Vérification des données d'entrées");

    const { token } = req.params;
    const { refreshToken } = req.params;

    /*console.log(token);
    console.log(token.length);
    console.log(refreshToken.length);*/

    //v8n
    if(isTokenHex(token) && isTokenHex(refreshToken)){
        if(process.env.DEVELOP === "true") console.log("Données d'entrées ok");
        else logger.info("Données d'entrées ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données d'entrées nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données d'entrées nok");
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

exports.validParamLogin = function (req, res, next){
    if(process.env.DEVELOP === "true") console.log("checkBody");
    else logger.info("Vérification des données d'entrées");

    //valid param req.body.csrf ?
    if(chatty) console.log(req.body)
    
    //v8n
    if(isEmail(req.body.email) && isStrongPassword(req.body.password)){
        if(process.env.DEVELOP === "true") console.log("Données d'entrées ok");
        else logger.info("Données d'entrées ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données d'entrées nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données d'entrées nok");
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

exports.validParamLogout = function (req, res, next){
    if(process.env.DEVELOP === "true") console.log("checkBody");
    else logger.info("Vérification des données d'entrées");

    //valid param req.body.csrf ?

    if(chatty) console.log('xsrf', req.headers.xsrftoken)

    //v8n
    if(isXSRFToken(req.headers.xsrftoken) && isTokenJWTaccess(req.cookies.access_token)){
        if(process.env.DEVELOP === "true") console.log("Données d'entrées ok");
        else logger.info("Données d'entrées ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données d'entrées nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données d'entrées nok");
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

exports.validParamUpdateToken = function (req, res, next){
    if(process.env.DEVELOP === "true") console.log("checkBody");
    else logger.info("Vérification des données d'entrées");

    //valid param req.body.csrf ?
    if(chatty) console.log('xsrf', req.headers.xsrftoken)

    //v8n
    if(isXSRFToken(req.headers.xsrftoken) /*&& isTokenJWTrefresh(req.headers.refresh_token)*/){
        if(process.env.DEVELOP === "true") console.log("Données d'entrées ok");
        else logger.info("Données d'entrées ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données d'entrées nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données d'entrées nok");
        res.status(config.erreurServer.ACCESS_REFUSED).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

exports.validParamEmailNewMDP = function (req, res, next){
    if(process.env.DEVELOP === "true") console.log("checkBody");
    else logger.info("Vérification des données d'entrées");

    //v8n
    if(isEmail(req.body.email)){
        if(process.env.DEVELOP === "true") console.log("Données d'entrées ok");
        else logger.info("Données d'entrées ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données d'entrées nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données d'entrées nok");
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

exports.validParamVerifMailNewMDP = function (req, res, next){
    if(process.env.DEVELOP === "true") console.log("checkBody");
    else logger.info("Vérification des données d'entrées");

    const { accessToken } = req.params;
    const { refreshToken } = req.params;

    if(chatty){
        console.log("access", accessToken);
        console.log("refresh", refreshToken);
    }

    //v8n
    if(isTokenHex(accessToken) && isTokenHex(refreshToken)){
        if(process.env.DEVELOP === "true") console.log("Données d'entrées ok");
        else logger.info("Données d'entrées ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données d'entrées nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données d'entrées nok");
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

exports.validParamUpdateMailNewMDP = function (req, res, next){
    if(process.env.DEVELOP === "true") console.log("checkBody");
    else logger.info("Vérification des données d'entrées");

    //console.log(req.headers.refresh_token);
    if(chatty) {
        console.log('xsrf', req.headers.xsrftoken)
        console.log('cookies', req.cookies)
    }

    //v8n
    if(isXSRFToken(req.headers.xsrftoken) && isTokenJWTaccess(req.cookies.access_token) && isTokenJWTrefresh(req.cookies.refresh_token) && 
        isStrongPassword(req.body.password) && isStrongPassword(req.body.passwordConfirm) && req.body.password === req.body.passwordConfirm){
        if(process.env.DEVELOP === "true") console.log("Données d'entrées ok");
        else logger.info("Données d'entrées ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données d'entrées nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données d'entrées nok");
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

exports.validParamMailNewMDP = function (req, res, next){
    if(process.env.DEVELOP === "true") console.log("checkBody");
    else logger.info("Vérification des données d'entrées");
    
    //valid param req.body.csrf ?
    if(chatty) console.log('xsrf', req.headers.xsrftoken)

    //v8n
    if(isXSRFToken(req.headers.xsrftoken) && isTokenJWTaccess(req.cookies.access_token) && isStrongPassword(req.body.password) && isStrongPassword(req.body.newPassword)){
        if(process.env.DEVELOP === "true") console.log("Données d'entrées ok");
        else logger.info("Données d'entrées ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données d'entrées nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données d'entrées nok");
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

exports.validParamGetProfile = function (req, res, next){
    if(process.env.DEVELOP === "true") console.log("checkBody");
    else logger.info("Vérification des données d'entrées");

    //valid param req.body.csrf ?
    if(chatty) console.log('xsrf', req.headers.xsrftoken)

    //v8n
    if(isXSRFToken(req.headers.xsrftoken) && isTokenJWTaccess(req.cookies.access_token)){
        if(process.env.DEVELOP === "true") console.log("Données d'entrées ok");
        else logger.info("Données d'entrées ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données d'entrées nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données d'entrées nok");
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

exports.validParamAuth = function (req, res, next) {
    if(chatty) console.log('xsrf', req.headers.xsrftoken)
    
    if(isXSRFToken(req.headers.xsrftoken) && isTokenJWTaccess(req.cookies.access_token)){
        if(process.env.DEVELOP === "true") console.log("Données auth ok");
        else logger.info("Données auth ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données auth nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données auth nok");
        
        res.status(config.erreurServer.BAD_IDENTIFICATION).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

exports.validParamAuthRefresh = function (req, res, next) {
    if(isTokenJWTaccess(req.cookies.refresh_token)){
        if(process.env.DEVELOP === "true") console.log("Données auth via refreshToken ok");
        else logger.info("Données auth via refreshToken ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données auth via refreshToken nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données auth via refreshToken nok");
        res.status(config.erreurServer.ACCESS_REFUSED).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

exports.validParamRecaptcha = function (req, res, next) {
    if(isRecaptcha(req.body.tokenRecaptcha)){
        if(process.env.DEVELOP === "true") console.log("Données recaptcha ok");
        else logger.info("Données recaptcha ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données recaptcha nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données recaptcha nok");
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

exports.validParamSetZoneRecherche = function (req, res, next) {
    if(chatty) {
        console.log('ville =', req.body.lieu)
        console.log('comm =', req.body.commentaire)
        console.log('tel =', req.body.tel)
        console.log('distance =', req.body.distance)
        console.log('budget =', req.body.budget)
        console.log('age =', req.body.age)
        console.log('situation =', req.body.situation)
        console.log('rechercheActive =', req.body.rechercheActive)
    }

    if(isLieu(req.body.lieu) && isCommentaire(req.body.commentaire) && isTel(req.body.tel) && isNumber(req.body.distance, 0, 999) &&
        isNumber(req.body.budget, 0, 9999) && isNumber(req.body.age, 18, 99) && isSituation(req.body.situation) && isBool(req.body.rechercheActive)){
        if(process.env.DEVELOP === "true") console.log("Données setZoneRecherche ok");
        else logger.info("Données setZoneRecherche ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données setZoneRecherche nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données setZoneRecherche nok");
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

exports.validParamGetZoneRecherche = function (req, res, next){
    if(process.env.DEVELOP === "true") console.log("checkBody");
    else logger.info("Vérification des données d'entrées");

    //valid param req.body.csrf ?
    if(chatty) console.log('xsrf', req.headers.xsrftoken)

    //v8n
    if(isXSRFToken(req.headers.xsrftoken) && isTokenJWTaccess(req.cookies.access_token)){
        if(process.env.DEVELOP === "true") console.log("Données d'entrées ok");
        else logger.info("Données d'entrées ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données d'entrées nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données d'entrées nok");
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

exports.validParamAddAnnonce = function (req, res, next){
    if(chatty) {
        console.log('photos =', req.body.photos)
        console.log('lieu =', req.body.lieu)
        console.log('loyerHC =', req.body.loyerHC)
        console.log('charges =', req.body.charges)
        console.log('type =', req.body.type)
        console.log('description =', req.body.description)
        console.log('nbreColocataire =', req.body.nbreColocataire)
        console.log('nbreColocOccupants =', req.body.nbreColocOccupants)
        console.log('mail =', req.body.mail)
        console.log('tel =', req.body.tel)
        console.log('titre annonce =', req.body.titreAnnonce)
        console.log('surface =', req.body.surface)
        console.log('Nbre pièces =', req.body.nbrePieces)
        console.log('Classe Energie =', req.body.classEnergie)
        console.log('ges =', req.body.ges)
        console.log('masquerNumero =', req.body.masquerNumero)
        console.log('refuseDemarcheCommercial =', req.body.refuseDemarcheCommercial)
        console.log('datePoster =', req.body.datePoster)
        console.log('annonceActive =', req.body.annonceActive)
        console.log('annonceValide =', req.body.annonceValide)
        console.log('meuble =', req.body.meuble)

        console.log('laveVaisselle =', req.body.laveVaisselle)
        console.log('wifi =', req.body.wifi)
        console.log('cuisineEquipe =', req.body.cuisineEquipe)
        console.log('television =', req.body.television)
        console.log('laveLinge =', req.body.laveLinge)
        console.log('chemine =', req.body.chemine)
        console.log('radElec =', req.body.radElec)
        console.log('chGaz =', req.body.chGaz)
        console.log('poele =', req.body.poele)
        console.log('detecFumee =', req.body.detecFumee)
        console.log('baignoire =', req.body.baignoire)
        console.log('sdbPriv =', req.body.sdbPriv)
        console.log('secheCheveux =', req.body.secheCheveux)
        console.log('linge =', req.body.linge)
        console.log('couvEtUstensiles =', req.body.couvEtUstensiles)
        console.log('ferRepasser =', req.body.ferRepasser)
        console.log('tancarville =', req.body.tancarville)
        console.log('dressing =', req.body.dressing)
        console.log('verrouCh =', req.body.verrouCh)
        console.log('refri =', req.body.refri)
        console.log('fourMicro =', req.body.fourMicro)
        console.log('equipCuisine =', req.body.equipCuisine)
        console.log('congelo =', req.body.congelo)
        console.log('four =', req.body.four)
        console.log('cafetiere =', req.body.cafetiere)
        console.log('barbecue =', req.body.barbecue)
        console.log('mobilierExt =', req.body.mobilierExt)
        console.log('camExt =', req.body.camExt)
        console.log('femmeDeMenage =', req.body.femmeDeMenage)
        console.log('gardien =', req.body.gardien)
        console.log('rangements =', req.body.rangements)
        console.log('bureau =', req.body.bureau)
    }
    
    if(isLieu(req.body.lieu) && isNumber(req.body.loyerHC,0,9999) && isNumber(req.body.charges,0,999) && isType(req.body.type) &&
    isNumber(req.body.nbreColocataire,0,20) && isNumber(req.body.nbreColocOccupants,0,20) && isEmail(req.body.mail) &&
    isTel(req.body.tel) && isTitreAnnonce(req.body.titreAnnonce) && isNumber(req.body.surface,0,500) &&
    isNumber(req.body.nbrePieces,0,30) && isClassEnergie(req.body.classEnergie) && isClassEnergie(req.body.ges) &&
    isBool(req.body.masquerNumero) && isBool(req.body.refuseDemarcheCommercial) /*&& isNumberDate(req.body.datePoster)*/ &&
    isBool(req.body.annonceActive) && isDescription(req.body.description) && isBool(req.body.annonceValide) &&
    isBool(req.body.meuble) && isBool(req.body.laveVaisselle) && isBool(req.body.wifi) && 
    isBool(req.body.cuisineEquipe) && isBool(req.body.television) && isBool(req.body.laveLinge) && isBool(req.body.chemine) && 
    isBool(req.body.radElec) && isBool(req.body.chGaz) && isBool(req.body.poele) && isBool(req.body.detecFumee) && 
    isBool(req.body.baignoire) && isBool(req.body.sdbPriv) && isBool(req.body.secheCheveux) && isBool(req.body.linge) && 
    isBool(req.body.couvEtUstensiles) && isBool(req.body.tancarville) && isBool(req.body.dressing) && isBool(req.body.verrouCh) && 
    isBool(req.body.refri) && isBool(req.body.fourMicro) && isBool(req.body.equipCuisine) && isBool(req.body.congelo) && 
    isBool(req.body.four) && isBool(req.body.cafetiere) && isBool(req.body.barbecue) && isBool(req.body.mobilierExt) && isBool(req.body.camExt) && 
    isBool(req.body.femmeDeMenage) && isBool(req.body.gardien) && isBool(req.body.rangements) && isBool(req.body.bureau) &&
    isBool(req.body.ferRepasser)){
        if(process.env.DEVELOP === "true") console.log("Données addAnnonce ok");
        else logger.info("Données addAnnonce ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données addAnnonce nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données addAnnonce nok");
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

exports.validParamUpdateAnnonce = function (req, res, next){
    if(chatty) {
        console.log('ref =', req.body.ref)
        console.log('photos =', req.body.photos)
        console.log('lieu =', req.body.lieu)
        console.log('loyerHC =', req.body.loyerHC)
        console.log('charges =', req.body.charges)
        console.log('type =', req.body.type)
        console.log('description =', req.body.description)
        console.log('nbreColocataire =', req.body.nbreColocataire)
        console.log('nbreColocOccupants =', req.body.nbreColocOccupants)
        console.log('mail =', req.body.mail)
        console.log('tel =', req.body.tel)
        console.log('titre annonce =', req.body.titreAnnonce)
        console.log('surface =', req.body.surface)
        console.log('Nbre pièces =', req.body.nbrePieces)
        console.log('Classe Energie =', req.body.classEnergie)
        console.log('ges =', req.body.ges)
        console.log('masquerNumero =', req.body.masquerNumero)
        console.log('refuseDemarcheCommercial =', req.body.refuseDemarcheCommercial)
        console.log('datePoster =', req.body.datePoster)
        console.log('annonceActive =', req.body.annonceActive)
        console.log('annonceValide =', req.body.annonceValide)
        console.log('datePoster =', req.body.datePoster)
        console.log('meublé ?', req.body.meuble);

        console.log('laveVaisselle =', req.body.laveVaisselle)
        console.log('wifi =', req.body.wifi)
        console.log('cuisineEquipe =', req.body.cuisineEquipe)
        console.log('television =', req.body.television)
        console.log('laveLinge =', req.body.laveLinge)
        console.log('chemine =', req.body.chemine)
        console.log('radElec =', req.body.radElec)
        console.log('chGaz =', req.body.chGaz)
        console.log('poele =', req.body.poele)
        console.log('detecFumee =', req.body.detecFumee)
        console.log('baignoire =', req.body.baignoire)
        console.log('sdbPriv =', req.body.sdbPriv)
        console.log('secheCheveux =', req.body.secheCheveux)
        console.log('linge =', req.body.linge)
        console.log('couvEtUstensiles =', req.body.couvEtUstensiles)
        console;log('ferRepasser =', req.body.ferRepasser)
        console.log('tancarville =', req.body.tancarville)
        console.log('dressing =', req.body.dressing)
        console.log('verrouCh =', req.body.verrouCh)
        console.log('refri =', req.body.refri)
        console.log('fourMicro =', req.body.fourMicro)
        console.log('equipCuisine =', req.body.equipCuisine)
        console.log('congelo =', req.body.congelo)
        console.log('four =', req.body.four)
        console.log('cafetiere =', req.body.cafetiere)
        console.log('barbecue =', req.body.barbecue)
        console.log('mobilierExt =', req.body.mobilierExt)
        console.log('camExt =', req.body.camExt)
        console.log('femmeDeMenage =', req.body.femmeDeMenage)
        console.log('gardien =', req.body.gardien)
        console.log('rangements =', req.body.rangements)
        console.log('bureau =', req.body.bureau)
    }
    
    if(isRef(req.body.ref) && isLieu(req.body.lieu) && isNumber(req.body.loyerHC,0,9999) && isNumber(req.body.charges,0,999) && isType(req.body.type) &&
    isNumber(req.body.nbreColocataire,0,20) && isNumber(req.body.nbreColocOccupants,0,20) && isEmail(req.body.mail) &&
    isTel(req.body.tel) && isTitreAnnonce(req.body.titreAnnonce) && isNumber(req.body.surface,0,500) &&
    isNumber(req.body.nbrePieces,0,30) && isClassEnergie(req.body.classEnergie) && isClassEnergie(req.body.ges) &&
    isBool(req.body.masquerNumero) && isBool(req.body.refuseDemarcheCommercial) /*&& isNumberDate(req.body.datePoster)*/ &&
    isBool(req.body.annonceActive) && isDescription(req.body.description) && isBool(req.body.annonceValide) &&
    isBool(req.body.meuble) && isBool(req.body.laveVaisselle) && isBool(req.body.wifi) && 
    isBool(req.body.cuisineEquipe) && isBool(req.body.television) && isBool(req.body.laveLinge) && isBool(req.body.chemine) && 
    isBool(req.body.radElec) && isBool(req.body.chGaz) && isBool(req.body.poele) && isBool(req.body.detecFumee) && 
    isBool(req.body.baignoire) && isBool(req.body.sdbPriv) && isBool(req.body.secheCheveux) && isBool(req.body.linge) && 
    isBool(req.body.couvEtUstensiles) && isBool(req.body.tancarville) && isBool(req.body.dressing) && isBool(req.body.verrouCh) && 
    isBool(req.body.refri) && isBool(req.body.fourMicro) && isBool(req.body.equipCuisine) && isBool(req.body.congelo) && 
    isBool(req.body.four) && isBool(req.body.cafetiere) && isBool(req.body.barbecue) && isBool(req.body.mobilierExt) && isBool(req.body.camExt) && 
    isBool(req.body.femmeDeMenage) && isBool(req.body.gardien) && isBool(req.body.rangements) && isBool(req.body.bureau) &&
    isBool(req.body.ferRepasser)){
        if(process.env.DEVELOP === "true") console.log("Données updateAnnonce ok");
        else logger.info("Données updateAnnonce ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données updateAnnonce nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données updateAnnonce nok");
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

exports.validParamSuppAnnonce = function (req, res, next){
    if(chatty) {
        console.log('ref =', req.body.ref)
    }
    
    if(isRef(req.body.ref)){
        if(process.env.DEVELOP === "true") console.log("Données suppAnnonce ok");
        else logger.info("Données suppAnnonce ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données suppAnnonce nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données suppAnnonce nok");
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

exports.validParamRef = function (req, res, next){

    if(chatty) {
        console.log('ref =', req.body)
    }
    
    if(isRef(req.body.ref)){
        if(process.env.DEVELOP === "true") console.log("Données validParamRef ok");
        else logger.info("Données validParamRef ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données validParamRef nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données validParamRef nok");
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

exports.validParamSuppOnePhoto = function (req, res, next){

    if(chatty) {
        console.log('index photo =', req.body.urlPhoto)
    }
    
    if(isUrlAnnonces(req.body.urlPhoto)){
        if(process.env.DEVELOP === "true") console.log("Données validParamSuppOnePhoto ok");
        else logger.info("Données validParamSuppOnePhoto ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données validParamSuppOnePhoto nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données validParamSuppOnePhoto nok");
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

exports.validParamSuppPhotos = function (req, res, next){

    if(chatty) {
        console.log('photos =', req.body.photos)
        console.log('ref =', req.body.ref)
    }
    
    if(isUrlPhotos(req.body.photos) && isRef(req.body.ref)){
        if(process.env.DEVELOP === "true") console.log("Données validParamSuppPhotosAnnonce ok");
        else logger.info("Données validParamSuppPhotosAnnonce ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données validParamSuppPhotosAnnonce nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données validParamSuppPhotosAnnonce nok");
        res.status(config.erreurServer.BAD_REQUEST).json({ error: process.env.MSG_ERROR_PRODUCTION });
        //next(false);
    }
};

//exemple
/*exports.reqValidation = function (req, res, next) {
    // username must be an email
    body('username').isEmail(),
    // password must be at least 5 chars long
    body('password').isLength({ min: 5 }),
    (req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            next();
        }
    }


    //Avec v8n
    console.log("username =", req.body.username)
    v8n()
        .string()
        .not.null()
        .minLength(4)
        .maxLength(10)
        .some.equal('@')
        //.between(4, 10)
        //.some.not.uppercase()
        //.not.every.lowercase()
        /*.some.equal('@')
        .numeric()
        .some.equal('.')
        .not.includes("<")
        .not.includes("&")
        .not.includes("'")
        .not.includes('"')
        .not.includes('*')
        .not.includes('/')
        .not.includes('$')*/
        /*.not.includes("<")
        .testAsync(req.body.username)
        .then(result => console.log("v8n ok"))
        .catch(result => console.log("v8n nok"));
};*/
