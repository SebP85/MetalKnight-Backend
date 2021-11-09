const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//const config = require('../config/config')

const colocSchema = mongoose.Schema({
    /*userId: { type: String, required: true, unique: true },
    expiresAt: { type: Date, default: Date.now() + config.token.refreshToken.expiresIn },
    refreshToken: { type: String, required: true },*/

    userId: { type: String, required: true, unique: true },
    lieu: { type: String, default: "" },
    distance: { type: Number, min: 0, max: 50, required: true },
    budget: { type: Number, min: 1, max: 9999, required: true },
    commentaire: { type: String },
    tel: { type: String },
    age: { type: Number, min: 18, max: 99, required: true },
    situation: { type: String, required: true },
    rechercheActive: { type: Boolean, required: true },
    avatar: { type: String },
    favoris_annonce: { type: [{ type: String }], },
    
});

colocSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Coloc', colocSchema);