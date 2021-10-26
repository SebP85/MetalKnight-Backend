/**
 * Paramètre de l'application
 * @module config/multer
 */

/**
 * Initialize the configuration.
 * @param {Object} env - The environment variables.
 */
 module.exports = env => ({
    maxSize: env.MAX_SIZE,
});