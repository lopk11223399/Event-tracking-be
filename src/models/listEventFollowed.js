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
      // ListEventFollow.hasMany(models.User, {
      //   foreignKey: "id",
      //   as: "followers",
      // });
      ListEventFollow.hasOne(models.Event, {
        foreignKey: "id",
      });
      ListEventFollow.belongsTo(models.Event, {
        foreignKey: "eventId",
        as: "eventData",
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
