/**
 * Transforme les messages avec des scripts
 */

var xss = require("xss");

//var html = xss('<script>alert("xss");</script>');
//console.log(html);

exports.filterRegister = function (req, res, next) {//on transforme les données si danger
    console.log("Name n°1", req.body.name);
    req.body.name = xss(req.body.name);
    console.log("Name n°2", req.body.name);

    next();
};