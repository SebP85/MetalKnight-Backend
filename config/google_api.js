/**
 * google api configuration.
 * @module config/google_api
 */

/**
 * Initialize the configuration.
 * @param {Object} env - The environment variables.
 */
 module.exports = env => ({
    CLIENT_ID: env.CLIENT_ID,
    CLIENT_SECRET: env.CLIENT_SECRET,
    REDIRECT_URI: env.REDIRECT_URI,
    REFRESH_TOKEN: env.REFRESH_TOKEN,
  });