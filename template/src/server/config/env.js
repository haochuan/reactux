/**
 *
 * Environment Config
 *
 */

const env = {
  production: {
    name: 'production',
    port: 3000
  },
  dev: {
    name: 'dev',
    port: 3000
  },
  test: {
    name: 'test',
    port: 3000
  }
};
export default env[process.env.NODE_ENV];
