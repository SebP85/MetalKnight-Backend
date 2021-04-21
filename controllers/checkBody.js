/**
 * Vérifie les données d'entrées de la requête
 */

 const { body, validationResult } = require('express-validator');

exports.register = function (req, res, next) {
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
};


//////faire les autres