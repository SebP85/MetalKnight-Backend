const config = require('../config/config');
//emailjs
const EmailValidator = require('email-deep-validator');//Valide un email

//Envoie des emails
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { logger } = require('../log/winston');

async function sendMail(email, subject, text, html) {
    try{
        const oAuth2Client = new google.auth.OAuth2(config.googleAPI.CLIENT_ID, config.googleAPI.CLIENT_SECRET, config.googleAPI.REDIRECT_URI);
        oAuth2Client.setCredentials({ refresh_token: config.googleAPI.REFRESH_TOKEN });

        if(process.env.DEVELOP === "true") console.log("fonction sendEmail");
        const accessToken = await oAuth2Client.getAccessToken();//erreur

        if(process.env.DEVELOP === "true") console.log("fonction createTransport");
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: config.email.ADRESSE_MAIL,
                clientId: config.googleAPI.CLIENT_ID,
                clientSecret: config.googleAPI.CLIENT_SECRET,
                refreshToken: config.googleAPI.REFRESH_TOKEN,
                accessToken: accessToken,

            }
        });

        if(process.env.DEVELOP === "true") console.log("Objet mailOptions");
        const mailOptions = {
            from: config.email.NOM_APP+' <'+config.email.ADRESSE_MAIL+'>',
            to: email,
            subject: "["+config.email.NOM_APP+"] "+subject,
            text: text,
            html: html,
        };

        if(process.env.DEVELOP === "true") console.log("sendEmail => Nodemailer");
        const result = transport.sendMail(mailOptions);

        return result;

    }catch(err){
        return err;
    }
}

exports.sendVerifyEmail = (email, token, refreshToken, callback) => {
    if(process.env.DEVELOP === "true") {
        console.log("Préparation de l'email");
        console.log("email", email);
        console.log("token", token);
        console.log("refreshToken", refreshToken);
    }

    //text = message court et html le message quand on l'ouvre
    var text = 'Mail de vérification';
    var html =  '<h1>Bienvenue sur '+config.email.NOM_APP+'</h1>'+
                '<p>Vous venez de vous inscrire sur notre site et nous vous en remercions.<br />'+
                `<a href=https://localhost:4000/apiMetalKnight/auth/verify/:${token}/:${refreshToken}>Cliquez ici</a> pour finaliser la vérification de votre compte.</p>`+
                '<p>Merci</p>';
    var subject = "Confirmation d'E-mail";

    if(process.env.DEVELOP === "true") console.log("Préparation de l'email ok");

    sendMail(email, subject, text, html)
        .then(r=> {
            //console.log("then sendveryfyemail");
            if(process.env.DEVELOP === "true") console.log('Email sent ...', r);
            else logger.info("email de vérification envoyé !");

            callback(true);
        })
        .catch(err => {
            //console.log("catch sendveryfyemail");
            if(process.env.DEVELOP === "true"){
                console.log(err.message);
                console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
            } else logger.error("Problème pour envoyer l'email de vérification !", err.message);

            callback(false);
        });
}

exports.sendConfirmationEmail = (email, callback) => {//Envoie le confirmation que le compte et l'email sont validé
    var text = 'Bienvenue sur '+config.email.NOM_APP+'\rNous vous informons que votre compte est validé !\rMerci de votre inscription';

    var html =  '<h1>Bienvenue sur '+config.email.NOM_APP+'</h1>'+
                '<p>Nous vous informons que votre compte est validé !<br />'+
                'Merci de votre inscription</p>';
    var subject = "Mail validé";

    sendMail(email, subject, text, html)
        .then(r=> {//communication avec le serveur ok
            if(process.env.DEVELOP === "true") console.log('Email sent ...', r);
            else logger.info("Email pour validation du compte envoyé !");

            callback(true);
        })
        .catch(err => {//erreur avec la communication du serveur
            if(process.env.DEVELOP === "true"){
                console.log(err.message);
                console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
            } else logger.error("Problème pour envoyer l'email de validation du compte !", err.message);

            callback(false);
        });
}

exports.checkEmail = async (req, res, next) => {//vérifie le domaine et si l'adresse est bien écrite pas si elle existe réellement
    const emailValidator = new EmailValidator({ timeout: 5000, verifyMailbox: true, verifyDomain: true });
    const { wellFormed, validDomain, validMailbox } = await emailValidator.verify(req.body.email);

    if(wellFormed & validDomain) {
        if(process.env.DEVELOP === "true"){
            console.log("email => "+req.body.email)
            if(wellFormed) { console.log("format ok") };
            if(validDomain) { console.log("domaine ok") };
            if(validMailbox) { console.log("MailBox ok") };

            console.log("format => "+wellFormed);
            console.log("domaine => "+validDomain);
            console.log("mailBox => "+validMailbox);//Ne marche pas
        } else logger.info("La vérification de l'email est ok (domaine et écrit)");
        next();
    } else
        if(process.env.DEVELOP === "true") {
            console.log("email nok");
            console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
        } else logger.error("La vérification de l'email est nok (domaine et écrit)");
};