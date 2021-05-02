const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

const config = require('../config/config');
const mail = require("../controllers/mail");
const { logger } = require('../log/winston');

exports.getProfile = (req, res, next) => {//Role autorisé Free
    if(process.env.DEVELOP === "true") console.log("fonction getProfile !");
    else logger.info("Requête getProfile lancée !");



    
};