module.exports = function (sequelize, DataTypes) {
  return sequelize.define("time_entry", {
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activity: {
      type: DataTypes.STRING
    },
    comments: {
      type: DataTypes.STRING
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    attachment: {
      type: DataTypes.BOOLEAN
    }
  }, {
    tableName: "time_entry"
  });
};
