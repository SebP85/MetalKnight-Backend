//Permet de vérifier chaque requête si c'est bien l'utilisateur et qu'il ne clique pas sur un lien dangereux

const { logger } = require('../log/winston');
const config = require('../config/config');

//ATTENTION = requête get = pas de protection

exports.getToken = (req, res, next) => {//On envoie le token CSRF pour s'assurer que la personne s'est connecté
    if(process.env.DEVELOP === "true") console.log('Envoie du csrfToken');
    else logger.info('Envoie du CSRF Token');

    res.cookie("XSRF-TOKEN", req.csrfToken(),
    {
        maxAge: config.token.accessToken.expiresIn,
        httpOnly: true,
        secure: true,
        path: config.cookie.pathCookie,
        signed: true,
    });
    
    
    next();
};

//normalement on en a pas besoin
/*exports.checkToken = (req, res, next) => {//on doit recevoir la valeur de _csrf dans le cookie
    if(process.env.DEVELOP === "true") console.log('Vérification csrfToken');
    else logger.info('Vérification du CSRF Token');

    console.log('csrf ???? ....................');

    next();

    
};*/