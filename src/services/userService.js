var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
import db from "../models";
const cloudinary = require("cloudinary").v2;

const hashPassword = (password) => bcrypt.hashSync(password, salt);

export const createUserByAdmin = ({ username, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOrCreate({
        where: { username },
        defaults: {
          username,
          password: hashPassword(password),
        },
      });
      const response1 = await db.Student.create({
        studentId: response[0].dataValues.id,
      });
      resolve({
        err: response[1] ? 0 : 1,
        message: response[1] ? "Create user success!!" : "username is exist",
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findAndCountAll({
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Role,
            as: "roleData",
            attributes: ["id", "nameRole"],
          },
          {
            model: db.Student,
            as: "studentData",
            attributes: [
              "studentId",
              "classCode",
              "program",
              "studentCode",
              "point",
            ],
          },
        ],
      });
      resolve({
        err: response ? 0 : 1,
        message: response ? "Got data" : "No data",
        response: response,
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { id: userId },
        attributes: {
          exclude: [
            "roleId",
            "isActive",
            "refresh_token",
            "createdAt",
            "updatedAt",
            "password",
          ],
        },
        include: [
          {
            model: db.Student,
            as: "studentData",
            attributes: [
              "studentId",
              "classCode",
              "program",
              "studentCode",
              "point",
            ],
          },
          {
            model: db.Faculty,
            as: "facultyData",
            attributes: ["faculty_code", "nameFaculty"],
          },
        ],
      });
      resolve({
        err: response ? 0 : 1,
        message: response ? "Got data" : "No data",
        response: response,
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const updateUser = (body, userId, fileData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fileImage = await db.User.findOne({
        where: { id: userId },
      });
      cloudinary.api.delete_resources(fileImage.dataValues.fileName);
      if (fileData) {
        body.avatar = fileData?.path;
        body.fileName = fileData?.filename;
      }
      const fieldsToExclude = [
        "password",
        "username",
        "roleId",
        "id",
        "refresh_token",
        "isActive",
      ];
      const myFields = Object.keys(db.User.rawAttributes).filter(
        (s) => !fieldsToExclude.includes(s)
      );
      const response = await db.User.update(body, {
        where: { id: userId },
        fields: myFields,
      });
      const response1 = await db.Student.update(body, {
        where: { studentId: userId },
        defaults: {
          classCode: body.classCode,
          program: body.program,
          studentCode: body.studentCode,
        },
      });
      resolve({
        err: response[0] > 0 && response1[0] > 0 ? 0 : 1,
        message:
          response[0] > 0 && response1[0] > 0 ? "Update successfully" : "not",
      });
      if (fileData && !response[0] === 0)
        cloudinary.uploader.destroy(fileData.filename);
    } catch (error) {
      reject(error);
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
  });
};

export const updateInfoAdmin = (body, userId, fileData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fileImage = await db.User.findOne({
        where: { id: userId },
      });
      cloudinary.api.delete_resources(fileImage.dataValues.fileName);
      if (fileData) {
        body.avatar = fileData?.path;
        body.fileName = fileData?.filename;
      }
      const response = await db.User.update(body, {
        where: { id: userId },
      });
      resolve({
        err: response[0] > 0 ? 0 : 1,
        message: response[0] > 0 ? "Update successfully" : "not",
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteUser = (body, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.update(body, {
        where: { id: userId },
      });
      resolve({
        err: response ? 0 : 1,
        message: response ? "Delete successfully" : "not",
        response: response,
      });
    } catch (error) {
      reject(error);
    }
  });
};
