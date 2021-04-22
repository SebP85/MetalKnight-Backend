/**
 * Vérifie les données d'entrées de la requête
 */

const { body, validationResult } = require('express-validator');//valide les paramètres avec des fonctions préprogrammées
const v8n = require('v8n');//valide les paramètres d'entrées et peutajouter des fonctions chainés
//voir https://imbrn.github.io/v8n/#what-s-v8n et https://github.com/imbrn/v8n/tree/master/src

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
        .not.includes("<")
        .testAsync(req.body.username)
        .then(result => console.log("v8n ok"))
        .catch(result => console.log("v8n nok"));
};


//////faire les autres