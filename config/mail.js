/**
 * Gestion des emails
 * @module config/mail
 */

/**
 * Initialize the configuration.
 * @param {Object} env - The environment variables.
 */
 module.exports = env => ({
    ADRESSE_MAIL: env.ADRESSE_MAIL,
    NOM_APP: env.NOM_APP,
  });