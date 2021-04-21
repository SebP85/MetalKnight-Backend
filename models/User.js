const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },//prénom
    lastName: { type: String, required: true },//nom
    password: { type: String, required: true },
    individu: { type: String, required: true },//un particulier ou un professionel
    birthday: { type: Date, required: true },//> à 18 ans
    civilite: { type: String, required: true },//madame ou monsieur
    role: { type: String, default: "free" },//free, expert, ...
    suspendu: { type: Number, default: 0 },
    userConfirmed: { type: Boolean, default: false },
    token: { type: String, required: true, unique: true },
    refreshToken: { type: String, required: true, unique: true },
    
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);