"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ListPeopleJoin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ListPeopleJoin.hasOne(models.Event, {
        foreignKey: "id",
      });
      // ListPeopleJoin.hasOne(models.Event, {
      //   foreignKey: "id",
      // });
      ListPeopleJoin.belongsTo(models.Event, {
        foreignKey: "eventId",
        as: "eventData",
      });
    }
  }
  ListPeopleJoin.init(
    {
      userId: DataTypes.INTEGER,
      eventId: DataTypes.INTEGER,
      roomId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ListPeopleJoin",
    }
  );
  return ListPeopleJoin;
};
