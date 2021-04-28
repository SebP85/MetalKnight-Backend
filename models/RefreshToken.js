const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const config = require('../config/config')

const userSchema = mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    expiresAt: { type: Date, default: Date.now() + config.token.refreshToken.expiresIn },
    refreshToken: { type: String, required: true },
    
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('RefreshToken', userSchema);