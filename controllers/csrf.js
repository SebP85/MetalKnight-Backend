const { logger } = require('../log/winston');
const config = require('../config/config');

exports.getToken = (req, res, next) => {
    if(process.env.DEVELOP === "true") console.log('Envoie du csrfToken');
    res.cookie("XSRF-TOKEN", req.csrfToken(),
    {
        maxAge: config.token.accessToken.expiresIn,
        httpOnly: true,
        secure: true,
        path: config.cookie.pathCookie,
        signed: true,
    });
    if(process.env.DEVELOP === "false") logger.info('Envoie du CSRF Token');
    
    next();
};

exports.checkToken = (req, res, next) => {//on doit recevoir la valeur de _csrf dans le cookie
    if(process.env.DEVELOP === "true") console.log('Vérification csrfToken');
    if(process.env.DEVELOP === "false") logger.info('Vérification du CSRF Token');
    next();

    /*if(process.env.DEVELOP === "true") {
        console.log("email nok");
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
    }*/
};