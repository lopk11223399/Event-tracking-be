"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OfflineEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OfflineEvent.init(
    {
      eventId: DataTypes.INTEGER,
      roomId: DataTypes.INTEGER,
      location: DataTypes.STRING,
      topic: DataTypes.STRING,
      numberRoom: DataTypes.INTEGER,
      timeRoom: DataTypes.STRING,
      qrCode: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "OfflineEvent",
    }
  );
  return OfflineEvent;
};
