const Sequelize = require('sequelize');

module.exports = new Sequelize('LEAVER', 'postgres', 'toorek', {
  host: 'localhost',
  dialect: 'postgres',
  define: {
      timestamps: false
  }
});

