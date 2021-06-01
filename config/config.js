const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');
const db = require('./database');
const token = require('./token');
const googleAPI = require('./google_api');
const email = require('./mail');
const cookie = require('./cookie');
const login = require('./login');
const role = require('./role');
const erreurServer = require('./erreur_server');

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
  cookie: cookie(env),
  login: login(env),
  role: role(env),
  erreurServer: erreurServer(env),
};