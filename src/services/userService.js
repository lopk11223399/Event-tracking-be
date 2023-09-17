import { badRequest, notAuth } from "../middlewares/handle_errors";
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
import db from "../models";

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
          ],
        },
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
