var bcrypt = require("bcryptjs");
import jwt from "jsonwebtoken";
import db from "../models";
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const hashPassword = (password) => bcrypt.hashSync(password, salt);

export const register = ({ username, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOrCreate({
        where: { username },
        defaults: {
          username,
          password: hashPassword(password),
        },
      });

      const accessToken = response[1]
        ? jwt.sign(
            {
              id: response[0].id,
              username: response[0].username,
              roleId: response[0].roleId,
            },
            process.env.JWT_SECRET,
            { expiresIn: "45s" }
          )
        : null;

      const refreshToken = response[1]
        ? jwt.sign(
            { id: response[0].id },
            process.env.JWT_SECRET_REFRESH_TOKEN,
            {
              expiresIn: "10d",
            }
          )
        : null;
      resolve({
        err: accessToken ? 0 : 1,
        message: accessToken ? "Register successfully" : `Username is exist`,

        // access_token: accessToken ? `Bearer ${accessToken}` : accessToken,
        access_token: accessToken ? `${accessToken}` : accessToken,
        refresh_token: refreshToken,
      });
      if (refreshToken) {
        await db.User.update(
          {
            refresh_token: refreshToken,
          },
          {
            where: { id: response[0].id },
          }
        );
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const login = ({ username, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { username },
        raw: true,
      });
      const isChecked =
        response && bcrypt.compareSync(password, response.password);
      const accessToken = isChecked
        ? jwt.sign(
            {
              id: response.id,
              username: response.username,
              roleId: response.roleId,
            },
            process.env.JWT_SECRET,
            { expiresIn: "45s" }
          )
        : null;

      const refreshToken = isChecked
        ? jwt.sign({ id: response.id }, process.env.JWT_SECRET_REFRESH_TOKEN, {
            expiresIn: "10d",
          })
        : null;
      resolve({
        err: accessToken ? 0 : 1,
        message: accessToken
          ? "Login successfully"
          : response
          ? "Password was wrong"
          : `Username is'n exist`,
        // access_token: accessToken ? `Bearer ${accessToken}` : accessToken,
        access_token: accessToken ? `${accessToken}` : accessToken,
        refresh_token: refreshToken,
      });
      if (refreshToken) {
        await db.User.update(
          {
            refresh_token: refreshToken,
          },
          {
            where: { id: response.id },
          }
        );
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const refreshToken = (refresh_token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { refresh_token },
      });
      if (response) {
        jwt.verify(
          refresh_token,
          process.env.JWT_SECRET_REFRESH_TOKEN,
          (err) => {
            if (err)
              resolve({
                err: 1,
                mess: "Refresh token expired. Require login again!!",
              });
            else {
              const accessToken = jwt.sign(
                {
                  id: response.id,
                  username: response.username,
                  roleId: response.roleId,
                },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
              );
              resolve({
                err: accessToken ? 0 : 1,
                mess: accessToken ? "Ok" : "Fail to generate new access token",
                // access_token: accessToken ? `Bearer ${accessToken}`: accessToken,
                access_token: accessToken ? `${accessToken}` : accessToken,
                refresh_token: refresh_token,
              });
            }
          }
        );
      }
    } catch (e) {
      reject(e);
    }
  });
