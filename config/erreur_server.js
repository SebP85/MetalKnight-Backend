/**
 * Gestion des emails
 * @module config/erreur
 */

/**
 * Initialize the configuration.
 * @param {Object} env - The environment variables.
 */
 module.exports = env => ({
    ADRESSE_MAIL: env.ADRESSE_MAIL,
    NOM_APP: env.NOM_APP,
    ERREUR_SERVER: env.ERREUR_SERVEUR,
    BAD_REQUEST: env.ERREUR_BAD_REQUEST,
    BAD_IDENTIFICATION: env.ERREUR_BAD_IDENTIFICATION,
    ACCESS_REFUSED: env.ERREUR_ACCESS_REFUSED,
    NOT_FOUND: env.ERREUR_NOT_FOUND,
  });