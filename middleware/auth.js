const jwt = require('jsonwebtoken');
const { logger } = require('../log/winston');
const config = require('../config/config');

module.exports = (req, res, next) => {//Vérification des tokens
  
  //Si expireAt de refreshToken expiré, users doit se reconnecter
  //et passer boolean connexion à false ?
  /************* A FAIRE *************/
  
  //console.log('req', req.headers);

  try {
    if(process.env.DEVELOP === "true") console.log("début authentification");
    else logger.info("début fonction authentification")
    const { cookies, headers } = req;

    //Gestion des cookies expiré ?
    
    if (!cookies || !cookies.access_token) return res.status(401).json({ message: 'Missing token in cookie' });//cookie présent ?
    const accessToken = cookies.access_token;

    if (!headers || !headers['xsrftoken']) return res.status(401).json({ message: 'Missing XSRF token in headers' });
    const xsrfToken = headers['xsrftoken'];

    const decodedToken = jwt.verify(accessToken, config.token.accessToken.secret, {
      algorithms: config.token.accessToken.algorithm
    });

    if(process.env.DEVELOP === "true") {
      console.log('xsrfToken', xsrfToken);
      console.log('decodedToken.xsrfToken', decodedToken.xsrfToken);
    
    }
    if (xsrfToken !== decodedToken.xsrfToken) {//si les tokens ne correspondent pas, on sort
      return res.status(401).json({ message: 'Bad xsrf token' });
    }

    //On vérifie la présence de l'utilisateur dans la base de données
    const userId = decodedToken.sub;
    /****************** recherche *****************/
    /*.then((user) => {
      if (!user) {
        return res.status(401).json({ message: `User ${userId} not exists` });
      }
    })*/

    //On ajoute l'utilisateur à la requête
    req.user = user;

    if(process.env.DEVELOP === "true") console.log('fin auth et ok');
    next();

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