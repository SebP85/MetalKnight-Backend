const User = require('../models/User');
const Coloc = require('../models/Coloc');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const config = require('../config/config');
const { logger } = require('../log/winston');

var chatty = false;

exports.setAnnonce = (req, res, next) => {//Role autorisé Free
    if(process.env.DEVELOP === "true") console.log("fonction setAnnonce !");
    else logger.info("Requête setAnnonce lancée !");

    if(process.env.DEVELOP === "true") {
        console.log("then coloc");
        res.status(201).json({ message: 'Création annonce ok !' });
    } else {
        res.status(201).json({ message: process.env.MSG_OK_PRODUCTION });
        logger.info("Création annonce ok");
    }

    next();
};