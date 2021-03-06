const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');
const db = require('./database');
const token = require('./token');
const googleAPI = require('./google_api');
const email = require('./mail');

const {resolve} = require('path');

let env = dotenv.config({path: resolve(__dirname,".env")});
if (env.error) throw env.error;
env = dotenvParseVariables(env.parsed);

/**
 * Global configuration.
 * @module config
 */
module.exports = {
  db: db(env),
  token: token(env),
  googleAPI: googleAPI(env),
  email: email(env),
};