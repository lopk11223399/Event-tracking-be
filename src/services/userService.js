var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
import db, { sequelize } from "../models";
const cloudinary = require("cloudinary").v2;
import { Op } from "sequelize";

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
        success: response[1] ? 0 : 1,
        mess: response[1] ? "Create user success!!" : "username is exist",
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllUsers = ({ page, limit, name, order, id, ...query }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const queries = { raw: true, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.LIMIT_USER;
      queries.offset = offset * fLimit;
      queries.limit = fLimit;
      if (order) queries.order = [order];
      if (name) query.name = { [Op.substring]: name };
      const response = await db.User.findAndCountAll({
        where: query,
        ...queries,
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
        success: response ? 0 : 1,
        mess: response ? "Got data" : "No data",
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
      const response = await db.User.findAll({
        where: {
          id: userId,
        },
        attributes: {
          exclude: [
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
            attributes: ["id", "classCode", "program", "studentCode", "point"],
          },
          {
            model: db.Faculty,
            as: "facultyData",
            attributes: ["id", "nameFaculty"],
          },
        ],
      });
      resolve({
        success: response ? true : false,
        mess: response ? "Got data" : "No data",
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
        success: response[0] > 0 && response1[0] > 0 ? 0 : 1,
        mess:
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
        success: response[0] > 0 ? 0 : 1,
        mess: response[0] > 0 ? "Update successfully" : "not",
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteUserByAdmin = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response1 = await db.Student.destroy({
        where: { studentId: userId },
      });
      const response = await db.User.destroy({
        where: { id: userId },
      });
      resolve({
        success: response ? 0 : 1,
        mess: response ? "Delete successfully" : "not",
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const changePassword = (body, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { id: userId },
      });
      const isChecked =
        response && bcrypt.compareSync(body.password, response.password);
      const response1 = isChecked
        ? body.newPassword == body.password
          ? "Must not match the old password"
          : await db.User.update(
              { password: hashPassword(body.newPassword) },
              { where: { id: userId } }
            )
        : "Password is wrong";
      resolve({
        success: response1[0] > 0 ? true : false,
        mess: response1[0] > 0 ? "Changed password successfully" : response1,
      });
    } catch (e) {
      reject(e);
    }
  });

export const getAllEventByUserId = (
  userId,
  { order, page, limit, ...query }
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const queries = { raw: false, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.LIMIT_USER;
      queries.distinct = true;
      queries.offset = offset * fLimit;
      queries.limit = fLimit;
      if (order) queries.order = [order];
      const response = await db.ListPeopleJoin.findAndCountAll({
        where: { userId: userId },
        ...queries,
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "EventId",
            "UserId",
            "userId",
            "eventId",
          ],
        },
        include: [
          {
            model: db.Event,
            as: "eventData",
          },
        ],
      });
      resolve({
        success: response ? true : false,
        mess: response ? "Get data success" : "Get data failure",
        response: response.rows,
        count: response.count,
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const updateRole = (query, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.update(
        { roleId: body.roleId },
        {
          where: { id: query.id },
        }
      );
      resolve({
        success: response[0] > 0 ? true : false,
        mess:
          response[0] > 0 ? "Update role ID success" : "Update role ID fail",
      });
    } catch (error) {
      reject(error);
    }
  });
};
