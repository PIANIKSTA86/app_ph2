const { Sequelize } = require('sequelize');
const config = require('config');

const dbConfig = config.get('database');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbConfig.storage,
  logging: dbConfig.logging ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = {
  sequelize,
  Sequelize
};
