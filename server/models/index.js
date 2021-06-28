const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const TimeEntry = require('./time-entry')(sequelize, Sequelize.DataTypes);

const db = {
  Sequelize: Sequelize,
  sequelize: sequelize,

  // link to model definitions and add to db variable
  TimeEntry: TimeEntry
};

db.sequelize.sync();

module.exports = db;
