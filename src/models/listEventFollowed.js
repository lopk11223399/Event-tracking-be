"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ListEventFollow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ListEventFollow.belongsTo(models.User, {
        foreignKey: "userId",
        as: "followers",
      });
    }
  }
  ListEventFollow.init(
    {
      userId: DataTypes.INTEGER,
      eventId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ListEventFollow",
    }
  );
  return ListEventFollow;
};
