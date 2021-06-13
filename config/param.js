/**
 * Paramètre de l'application
 * @module config/param
 */

/**
 * Initialize the configuration.
 * @param {Object} env - The environment variables.
 */
module.exports = env => ({
    develop: env.DEVELOP,
});