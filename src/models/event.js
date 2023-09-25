"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Status, {
        foreignKey: "status",
        targetKey: "id",
        as: "statusEvent",
      });
      Event.belongsTo(models.Category, {
        foreignKey: "categoryEvent",
        targetKey: "id",
        as: "categoryData",
      });
      Event.hasOne(models.User, {
        foreignKey: "id",
      });
    }
  }
  Event.init(
    {
      creatorId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      startDate: DataTypes.STRING,
      finishDate: DataTypes.STRING,
      image: DataTypes.STRING,
      description: DataTypes.TEXT,
      typeEvent: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      categoryEvent: DataTypes.INTEGER,
      totalRate: DataTypes.FLOAT,
      qrCode: DataTypes.STRING,
      fileNameImage: DataTypes.STRING,
      fileNameQr: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  // Event.removeAttribute("id");
  return Event;
};
