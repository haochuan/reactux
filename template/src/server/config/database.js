/**
 *
 * Database Config
 * Examples:
 */

/*
 * MongoDB
 * import mongoose from 'mongoose';
 * import env from './env';
 * const dbHost = {
 *  dev: 'xxxxxx',
 *  production: 'xxxxx'
 * };
 * mongoose.connect(dbHost[env.name]);
 * mongoose.Promise = require('bluebird');
 */

/*
 * Mysql
 * import mysql from 'mysql';
 * import env from './env';
 * const settings = {
 *  dev: {
 *    host: 'xxxx',
 *    user: 'xxxx',
 *    database: 'xxxxx'
 *  },
 *  production: {
 *    host: 'xxxx',
 *    user: 'xxxx',
 *    database: 'xxxxx'
 *  }
 * };
 * const pool = mysql.createPool(settings[env.name]);
 * const getMysqlConnection = (cb) {
 *  pool.getConnection((err, connection) => {
 *    if (err) throw err;
 *    cb(connection);
 *  });
 * }
 * export default getMysqlConnection;
 */

/*
 * Or you can also use ORM:
 *
 *  - Bookshelf.js
 *  - Sequelize.js
 */
