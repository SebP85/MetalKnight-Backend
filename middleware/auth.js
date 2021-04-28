const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {//Vérification des tokens
  
  //Si expireAt de refreshToken expiré, users doit se reconnecter
  /************* A FAIRE *************/
  
  try {
    if(process.env.DEVELOP === "true") console.log("début authentification");
    const { cookies, headers } = req;

    if (!cookies || !cookies.access_token) return res.status(401).json({ message: 'Missing token in cookie' });//cookie présent ?
    const accessToken = cookies.access_token;

    if (!headers || !headers['xsrfToken']) return res.status(401).json({ message: 'Missing XSRF token in headers' });
    const xsrfToken = headers['xsrfToken'];

    const decodedToken = jwt.verify(accessToken, config.token.accessToken.secret, {
      algorithms: config.token.accessToken.algorithm
    });

/*
    const token = req.headers.authorization.split(' ')[1];
    //console.log("token_serv => "+token)
    const decodedToken = jwt.verify(token, config.token.accessToken.secret);
    if(process.env.DEVELOP === "true") console.log("decodedToken => "+JSON.stringify(decodedToken));
    const userId = decodedToken.userId;
    if(process.env.DEVELOP === "true") console.log("userId_serv => "+userId)

    

    //Gestion des cookies
    //const { cookies } = req;
    /* On vérifie et décode le token à l'aide du secret et de l'algorithme utilisé pour le générer */
    //const decodedCookie = req;
    //console.log("cookie => "+decodedCookie);
/*
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }*/





  } catch {
    if(process.env.DEVELOP === "true") console.log("erreur authentification !")
    if(process.env.DEVELOP === "true")
      res.status(401).json({
        error: new Error('Invalid request!')
        
      });
    else
      res.status(401).json({
        error: new Error(process.env.MSG_ERROR_PRODUCTION)
        
      });
  }
};