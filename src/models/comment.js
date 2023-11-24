"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.hasOne(models.Event, {
        foreignKey: "id",
      });

      Comment.belongsTo(models.User, {
        foreignKey: "userId",
        as: "userData",
      });

      Comment.belongsToMany(models.User, {
        through: "ResponseComment",
        as: "responseComment",
      });
    }
  }
  Comment.init(
    {
      userId: DataTypes.INTEGER,
      eventId: DataTypes.INTEGER,
      comment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
