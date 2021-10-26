//Permet de vérifier chaque requête si c'est bien l'utilisateur et qu'il ne clique pas sur un lien dangereux

const { logger } = require('../log/winston');
const config = require('../config/config');

//ATTENTION = requête get = pas de protection
//var csrf = require('csurf');
//var bodyParser = require('body-parser');

exports.getTokenCSRF = (req, res, next) => {//On envoie le token CSRF pour s'assurer que la personne s'est connecté
    if(process.env.DEVELOP === "true") console.log('Envoie du csrfToken');
    else logger.info('Envoie du CSRF Token');

    var token  = req.csrfToken();

    res.cookie('XSRF-TOKEN', token,
    {
        //maxAge: config.token.refreshToken.expiresIn,
        //httpOnly: true,
        //signed: true,
        secure: true,
        path: '/',
        sameSite: 'strict',
    });
    res.locals.csrfToken = token;
    
    if(config.param.develop)
        res.status(200).json({ message: "Token CSRF envoyé :", token });
    else
        res.status(200).json({ message: process.env.MSG_OK_PRODUCTION });
    
    next();
};

//normalement on en a pas besoin
/*exports.checkToken = (req, res, next) => {//on doit recevoir la valeur de _csrf dans le cookie
    if(process.env.DEVELOP === "true") console.log('Vérification csrfToken');
    else logger.info('Vérification du CSRF Token');

    console.log('csrf ???? ....................');

    next();

    
};*/