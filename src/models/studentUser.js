"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Student.belongsTo(models.User, {
      //   foreignKey: "studentId",
      //   targetKey: "id",
      //   as: "studentData",
      // });
    }
  }
  Student.init(
    {
      studentId: DataTypes.INTEGER,
      classCode: DataTypes.STRING,
      program: DataTypes.STRING,
      studentCode: DataTypes.STRING,
      point: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Student",
    }
  );
  return Student;
};
