const config = require('../config/config');

exports.getToken = (req, res, next) => {
    if(process.env.DEVELOP === "true") console.log('Envoie du csrfToken');
    res.cookie("XSRF-TOKEN", req.csrfToken(),
    {
        maxAge: config.token.refreshToken.expiresIn,
        httpOnly: true,
        secure: true,
        path: '/vbgfhnj',
    });
    //req.body.csrfToken = req.csrfToken();//ajoute dans le corp de la requête
    //console.log(req);
    next();
};

exports.checkToken = (req, res, next) => {//on doit recevoir la valeur de _csrf dans le cookie
    if(process.env.DEVELOP === "true") console.log('Vérification csrfToken');
    next();

    /*if(process.env.DEVELOP === "true") {
        console.log("email nok");
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
    }*/
};