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
      Event.hasOne(models.User, {
        foreignKey: "id",
      });
      Event.belongsTo(models.User, {
        foreignKey: "creatorId",
        as: "author",
      });
      Event.hasMany(models.OfflineEvent, {
        foreignKey: "eventId",
        as: "offlineEvent",
      });
      Event.hasMany(models.OnlineEvent, {
        foreignKey: "eventId",
        as: "onlineEvent",
      });
      Event.belongsToMany(models.User, {
        through: "ListEventFollow",
        as: "followers",
      });
      Event.belongsToMany(models.User, {
        through: "Comment",
        as: "commentEvent",
      });
      Event.belongsToMany(models.User, {
        through: "ListPeopleJoin",
        as: "userJoined",
      });
      Event.belongsToMany(models.User, {
        through: "Feedback",
        as: "feedback",
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
      // addPoint: DataTypes.FLOAT,
      // limitParticipant: DataTypes.INTEGER,
      fileNameImage: DataTypes.STRING,
      fileNameQr: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
