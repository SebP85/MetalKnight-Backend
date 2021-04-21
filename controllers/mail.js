const config = require('../config/config');
//emailjs
const EmailValidator = require('email-deep-validator');//Valide un email

//Envoie des emails
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(config.googleAPI.CLIENT_ID, config.googleAPI.CLIENT_SECRET, config.googleAPI.REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: config.googleAPI.REFRESH_TOKEN });

async function sendMailToVerify(email) {
    try{
        const accessToken = await oAuth2Client.getAccessToken();

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

        const mailOptions = {
            from: config.email.NOM_APP+' <'+config.email.ADRESSE_MAIL+'>',
            to: email,
            subject: "["+config.email.NOM_APP+"] Confirmation d'E-mail",
            text: 'Mail de vérification',
            html: '<p><a href=https://localhost:4000/apiMetalKnight/auth/verify/${token}/${tokenRefresh}>Cliquez ici</a> pour vérifier votre adresse. Merci</p>',
        };

        const result = transport.sendMail(mailOptions);

        return result;

    }catch(err){
        return err;
    }
}

exports.sendEmail = (req, res, next) => {
    sendMailToVerify(req.body.email)
        .then(r=> {
            if(process.env.DEVELOP === "true") console.log('Email sent ...', r);
            next();
        })
        .catch(err => {
            if(process.env.DEVELOP === "true"){
                console.log(err.message);
                console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
            }
        });

    
};

exports.checkEmail = async (req, res, next) => {//vérifie le domaine et l'adresse est bien écrite pas si elle existe réellement
    const emailValidator = new EmailValidator({ timeout: 5000, verifyMailbox: true, verifyDomain: true });
    const { wellFormed, validDomain, validMailbox } = await emailValidator.verify(/*'sebastien.picot2@gmail.com'*/req.body.email);

    if(process.env.DEVELOP === "true"){
        console.log("email => "+req.body.email)
        if(wellFormed) { console.log("format ok") };
        if(validDomain) { console.log("domaine ok") };
        if(validMailbox) { console.log("MailBox ok") };

        console.log("format => "+wellFormed);
        console.log("domaine => "+validDomain);
        console.log("mailBox => "+validMailbox);//Ne marche pas
    }

    if(wellFormed & validDomain)
        next();
    else
    if(process.env.DEVELOP === "true") {
        console.log("email nok");
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
    }
};