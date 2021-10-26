const multer = require('multer');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const crypto = require('crypto');

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
    const name = crypto.randomBytes(16).toString('hex');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + '_' + new Date().getTime() + '.' + extension);
  },
  limits: { fileSize: config.multer.maxSize },//1048576b => 10 Mb

  //Effacer si fichier existant (userId.png et userId.jpg)
});

module.exports = multer({storage: storage}).single('image');