"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, {
        foreignKey: "roleId",
        targetKey: "id",
        as: "roleData",
      });
      User.belongsTo(models.Student, {
        foreignKey: "id",
        targetKey: "studentId",
        as: "studentData",
      });
      User.belongsTo(models.Faculty, {
        foreignKey: "facultyCode",
        targetKey: "faculty_code",
        as: "facultyData",
      });
      User.hasMany(models.Event, {
        foreignKey: "creatorId",
        as: "eventData",
      });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      roleId: DataTypes.INTEGER,
      gender: DataTypes.BOOLEAN,
      birthDate: DataTypes.DATEONLY,
      address: DataTypes.TEXT,
      phone: DataTypes.STRING,
      avatar: DataTypes.STRING,
      facultyCode: DataTypes.STRING,
      isActive: DataTypes.TINYINT,
      refresh_token: DataTypes.STRING,
      fileName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
