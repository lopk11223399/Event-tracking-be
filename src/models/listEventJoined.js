"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ListEventJoin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ListEventJoin.belongsTo(models.Event, {
        foreignKey: "eventId",
        targetKey: "id",
        as: "eventData",
      });
    }
  }
  ListEventJoin.init(
    {
      userId: DataTypes.INTEGER,
      eventId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ListEventJoin",
    }
  );
  return ListEventJoin;
};
