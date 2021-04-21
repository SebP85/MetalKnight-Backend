/**
 * Fonctionne avec knexjs avec plusieurs BDD différentes
 */

//Installation: npm install knex --save

//Installation du package de la BDD choisie
/**
 * npm install pg
 * npm install sqlite3
 * npm install mysql
 * npm install mysql2
 * npm install oracledb
 * npm install mssql
 */

//Config

const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'your_database_user',
      password : 'your_database_password',
      database : 'myapp_test'
    }
  });

  //a approfondir si BDD SQL => http://knexjs.org/