"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OnlineEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OnlineEvent.hasOne(models.Event, {
        foreignKey: "id",
      });
    }
  }
  OnlineEvent.init(
    {
      eventId: DataTypes.INTEGER,
      roomId: DataTypes.INTEGER,
      linkUrl: DataTypes.STRING,
      topic: DataTypes.STRING,
      linkRoomUrl: DataTypes.STRING,
      timeRoom: DataTypes.STRING,
      qrCode: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "OnlineEvent",
    }
  );
  return OnlineEvent;
};
