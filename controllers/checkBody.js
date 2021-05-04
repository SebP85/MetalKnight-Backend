/**
 * Vérifie les données d'entrées de la requête
 */
 const { logger } = require('../log/winston');

//const { body, validationResult, oneOf } = require('express-validator');//valide les paramètres avec des fonctions préprogrammées
const v8n = require('v8n');//valide les paramètres d'entrées et peutajouter des fonctions chainés
//voir https://imbrn.github.io/v8n/#what-s-v8n et https://github.com/imbrn/v8n/tree/master/src et https://imbrn.github.io/v8n/api/#testasync

function isEmail(val){
    var v = v8n()
        .string()
        .not.null()
        .minLength(5)
        .maxLength(55)
        .some.equal('@')
        .some.equal('.')
        .test(val);

    //console.log("email", v);
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
        .pattern(/[%@_$|#?!]/)//doit avoir un des caractères acceptés entre [], ne peut pas être /[]
        .not.includes('&')//caractère spéciaux interdits
        .not.includes('{')
        .test(val);

    //console.log("password", v);
    if(!v && process.env.DEVELOP === "false") logger.error("Password =>", val);

    return v;
}

function isIndividu(val){
    var v = v8n()
        .string()
        .passesAnyOf(v8n().exact("un particulier"), v8n().exact("un professionnel"))
        .test(val);

    //console.log("individu", v);
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

    //console.log("firstName", v);
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

    //console.log("lastName", v);
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

    console.log("date", v);
    if(!v && process.env.DEVELOP === "false") logger.error("date =>", val);

    return v;
}

function isCivilite(val){
    var v = v8n()
        .string()
        .passesAnyOf(v8n().exact("monsieur"), v8n().exact("madame"))
        .test(val);

    //console.log("civilite", v);
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

    //console.log("token/refreshToken", v);
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

    //console.log("xsrfToken", v);
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

    //console.log("jwtAccessToken", v);
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

    //console.log("jwtRefreshToken", v);
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

    console.log("Base64Token", v);
    if(!v && process.env.DEVELOP === "false") logger.error("Base64Token =>", val);

    return v;
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
        
    }
};

exports.validParamLogin = function (req, res, next){
    if(process.env.DEVELOP === "true") console.log("checkBody");
    else logger.info("Vérification des données d'entrées");

    //valid param req.body.csrf ?

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
        
    }
};

exports.validParamLogout = function (req, res, next){
    if(process.env.DEVELOP === "true") console.log("checkBody");
    else logger.info("Vérification des données d'entrées");

    //valid param req.body.csrf ?

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
        
    }
};

exports.validParamUpdateToken = function (req, res, next){
    if(process.env.DEVELOP === "true") console.log("checkBody");
    else logger.info("Vérification des données d'entrées");

    //valid param req.body.csrf ?

    //v8n
    if(isXSRFToken(req.headers.xsrftoken) && isTokenJWTrefresh(req.headers.refresh_token)){
        if(process.env.DEVELOP === "true") console.log("Données d'entrées ok");
        else logger.info("Données d'entrées ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données d'entrées nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données d'entrées nok");
        
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
        
    }
};

exports.validParamVerifMailNewMDP = function (req, res, next){
    if(process.env.DEVELOP === "true") console.log("checkBody");
    else logger.info("Vérification des données d'entrées");

    const { accessToken } = req.params;
    const { refreshToken } = req.params;

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
        
    }
};

exports.validParamUpdateMailNewMDP = function (req, res, next){
    if(process.env.DEVELOP === "true") console.log("checkBody");
    else logger.info("Vérification des données d'entrées");

    //console.log(req.headers.refresh_token);

    //v8n
    if(isXSRFToken(req.headers.xsrftoken) && isTokenJWTaccess(req.cookies.access_token) && isTokenJWTrefresh(req.headers.refresh_token) && 
        isStrongPassword(req.body.password)){
        if(process.env.DEVELOP === "true") console.log("Données d'entrées ok");
        else logger.info("Données d'entrées ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données d'entrées nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données d'entrées nok");
        
    }
};

exports.validParamMailNewMDP = function (req, res, next){
    if(process.env.DEVELOP === "true") console.log("checkBody");
    else logger.info("Vérification des données d'entrées");

    //valid param req.body.csrf ?

    //v8n
    if(isXSRFToken(req.headers.xsrftoken) && isTokenJWTaccess(req.cookies.access_token) && isStrongPassword(req.body.password)){
        if(process.env.DEVELOP === "true") console.log("Données d'entrées ok");
        else logger.info("Données d'entrées ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") {
            console.log("Données d'entrées nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("Données d'entrées nok");
        
    }
};

exports.validParamGetProfile = function (req, res, next){
    if(process.env.DEVELOP === "true") console.log("checkBody");
    else logger.info("Vérification des données d'entrées");

    //valid param req.body.csrf ?

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
