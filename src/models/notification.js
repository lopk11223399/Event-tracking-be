"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notification.belongsTo(models.TypeNotification, {
        foreignKey: "notification_code",
        as: "notiData",
      });
      Notification.belongsTo(models.Event, {
        foreignKey: "eventId",
        as: "eventData",
      });
    }
  }
  Notification.init(
    {
      userId: DataTypes.INTEGER,
      eventId: DataTypes.INTEGER,
      isWatched: DataTypes.BOOLEAN,
      content: DataTypes.STRING,
      notification_code: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );
  // Event.removeAttribute("id");
  return Notification;
};
