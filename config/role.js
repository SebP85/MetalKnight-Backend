/**
 * Role configuration.
 * @module config/role
 */

/**
 * Initialize the configuration.
 * @param {Object} env - The environment variables.
 */
 module.exports = env => ({
    roleFree: env.ROLE_FREE,
    roleAmateur: env.ROLE_LEVEL1,
    roleExpert: env.ROLE_LEVEL2,
    roleAdmin: env.ROLE_ADMIN,
  });