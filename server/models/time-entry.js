module.exports = function (sequelize, DataTypes) {
  return sequelize.define('time_entry', {
    course: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    stopTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    attachment: {
      type: DataTypes.BOOLEAN
    }
  }, {
    tableName: 'time_entry'
  });
};
