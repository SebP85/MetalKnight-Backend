/**
 * Login configuration
 * @module config/login
 */

/**
 * Initialize the configuration.
 * @param {Object} env - The environment variables.
 */
 module.exports = env => ({
    MAX_CONNEXION: env.MAX_CONNEXION,
    DELAI_AVANT_NOUVELLE_RECONNEXION: env.DELAI_AVANT_NOUVELLE_RECONNEXION,
});