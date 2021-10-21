const multer = require('multer');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'Images/Avatar');
  },
  filename: (req, file, callback) => {
    //Identification de l'ID de l'utilisateur
    const { cookies } = req;
    const accessToken = cookies.access_token;
    const decodedToken = jwt.verify(accessToken, config.token.accessToken.secret, {
      algorithms: config.token.accessToken.algorithm
    });

    const name = decodedToken.sub;
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + '_' + new Date().getTime() + '.' + extension);
  }

  //Effacer si fichier existant (userId.png et userId.jpg)
});

module.exports = multer({storage: storage}).single('image');