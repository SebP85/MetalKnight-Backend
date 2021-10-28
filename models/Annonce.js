const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const moment = require('moment');
//const config = require('../config/config')

const annonceSchema = mongoose.Schema({

    userId: { type: String, required: true },
    lieu: { type: String, required: true },
    loyerHC: { type: Number, min: 0, max: 9999, required: true },
    charges: { type: Number, min: 0, max: 999, required: true },
    type: { type: String, required: true },
    nbreColocataire: { type: Number, min: 0, max: 20, required: true },
    nbreColocOccupants: { type: Number, min: 0, max: 20, required: true },
    mail: { type: String, required: true },
    tel: { type: String },
    titreAnnonce: { type: String, max: 255 ,required: true },
    description: { type: String, max: 1500 ,required: true },
    surface: { type: Number, min: 0, max: 500, required: true },
    nbrePieces: { type: Number, min: 0, max: 30, required: true },
    classEnergie: { type: String, required: true },
    ges: { type: String, required: true},
    masquerNumero: { type: Boolean, required: true },  
    refuseDemarcheCommercial: { type: Boolean, required: true },
    datePoster: { type: Date, default: moment() },//date:heure:minute:seconde de fin de suspension
    annonceActive: { type: Boolean, required: true },
    annonceValide: { type: Boolean, default: false },
    //photos: { type: Array, maxItems: 10, default: [] },
    photos: {
        type: [{
            type: String,//Schema.Types.ObjectId,
            ref: 'photosModel'
        }],
        validate: [arrayLimit, '{PATH} exceeds the limit of 10'],
    }
    
});

function arrayLimit(val) {
    return val.length <= 10;
}

annonceSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Annonce', annonceSchema);