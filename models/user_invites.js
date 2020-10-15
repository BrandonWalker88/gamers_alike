module.exports = function (sequelize, DataTypes) {
  const userInvites = sequelize.define("userInvites", {
    send_id: {
      type: DataTypes.INTEGER,
      validate: {
        notNull: true,
      },
    },
    receive: {
      type: DataTypes.INTEGER,
      validate: {
        notNull: true,
      },
    },
    accepted: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
    voice_chat: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
  });

  return userInvites;
};
