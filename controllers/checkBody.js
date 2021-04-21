/**
 * Vérifie les données d'entrées de la requête
 */

const validateRequest = require('express-body-validator');
const handleError = require('../lib/handleError');

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,6}$/i;

exports.register = function (req, res) {
    validateRequest(req, [
        { name: 'email', type: 'string', validator: v => v.pattern(emailRegex), failMsg: 'email must be an email string' },
        { name: 'password', type: 'string', validator: v => v.minLength(8).maxLength(50), failMsg: 'password must be comprised between 8 and 50 chars' }
    ])
    //.then(post => userModel.create(post.email, post.password))
    //.then(([id, token]) => res.status(201).json({ id, token }))
    .then( () => next())
    .catch(err => handleError(err, res));
};