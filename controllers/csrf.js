const { logger } = require('../log/winston');
const config = require('../config/config');

exports.getToken = (req, res, next) => {
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

exports.checkToken = (req, res, next) => {//on doit recevoir la valeur de _csrf dans le cookie
    if(process.env.DEVELOP === "true") console.log('Vérification csrfToken');
    else logger.info('Vérification du CSRF Token');
    next();

    /*if(process.env.DEVELOP === "true") {
        console.log("email nok");
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
    }*/
};