module.exports = function (sequelize, DataTypes) {
  const Friends = sequelize.define("Friends", {
    send_id: {
      type: DataTypes.INTEGER,
      validate: {
        notNull: false,
      },
    },
    receive: {
      type: DataTypes.INTEGER,
      validate: {
        notNull: false,
      },
    },
    accepted: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
  });

  return Friends;
};
