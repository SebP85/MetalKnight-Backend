/**
 * Vérifie les données d'entrées de la requête
 */

const { body, validationResult, oneOf } = require('express-validator');//valide les paramètres avec des fonctions préprogrammées
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

    //console.log("v1 ", v);
    if(!V && process.env.DEVELOP === "false") logger.error("Email =>", val);

    return v;
}

function isStrongPassword(val){
    var v = v8n()
        .string()
        .not.null()
        .minLength(8)
        .maxLength(55)
        .some.lowercase()
        .some.uppercase()
        .some.numeric()
        .pattern(/.*[-+!*$@%_^|~#'"`.:;,?<>ø£€ùµ°=()éèê]/)//doit avoir un des caractères acceptés entre [], ne peut pas être /[]
        .not.includes('&')//caractère spéciaux interdits
        .not.includes('{')
        .test(val);

    //console.log("v2 ", v);
    if(!V && process.env.DEVELOP === "false") logger.error("Password =>", val);

    return v;
}

exports.validParamRegister = function (req, res, next){
    if(process.env.DEVELOP === "true") console.log("checkBody");
    if(process.env.DEVELOP === "false") logger.info("Vérification des données d'entrées");

    //v8n
    if(isEmail(req.body.email) && isStrongPassword(req.body.password)){
        if(process.env.DEVELOP === "true") console.log("Données d'entrées ok");
        if(process.env.DEVELOP === "false") logger.error("Données d'entrées ok");
        next();
    } else {
        if(process.env.DEVELOP === "true") console.log("Données d'entrées nok");
        if(process.env.DEVELOP === "false") logger.error("Données d'entrées nok");
    }

    
};

exports.reqValidation = function (req, res, next) {
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
        .not.includes("<")
        .testAsync(req.body.username)
        .then(result => console.log("v8n ok"))
        .catch(result => console.log("v8n nok"));
};


//////faire les autres