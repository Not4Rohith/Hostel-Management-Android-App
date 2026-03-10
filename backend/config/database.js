const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './hostel.sqlite', // This creates the file in your root folder
  logging: false, // Set to console.log to see SQL queries
});

module.exports = sequelize;



// Sets up the SQLite database connection
// Initializes tables or exports the DB instance
// Used by models to interact with the database