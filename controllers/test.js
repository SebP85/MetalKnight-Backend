/**
 * 
 * 1-Valider CSRF
 * 2-Valider données d'entrée (noSQL, SQL, pas de script, regex, redos attack, ...)
 * 3-filtrer xss
 * 4-filtrer xml (si besoin)
 * 5-décryptage données d'entrée (cookie+JWT+API key+formulaire envoyé)
 * 6-authentification
 */


exports.typeGet = (req, res, next) => {//
    console.log("fonction get de test !");
    //console.log(req);
    res.status(200).json({ message: 'OK' });
    next();

    /*if(process.env.DEVELOP === "true") {
        console.log("email nok");
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
    }*/
};

exports.login = (req, res, next) => {//
    console.log("fonction login de test !");
    
    res.status(200).json({ message: 'OK' });
    next();

    //console.log(req.body.csrfToken);

    /*if(process.env.DEVELOP === "true") {
        console.log("email nok");
        console.log('---------------------------------------------------------    Requête erreur    ------------------------------------------------------------------');
    }*/
};