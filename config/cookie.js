/**
 * Cookie configuration
 * @module config/cookie
 */

/**
 * Initialize the configuration.
 * @param {Object} env - The environment variables.
 */
 module.exports = env => ({
    pathCookie: env.PATH_COOKIE,
    refreshToken: {
      pathCookie: env.PATH_COOKIE_REFRESH_TOKEN,
      pathCookieNewPassword: env.PATH_COOKIE_REFRESH_TOKEN_NEW_MDP,
    }
  });