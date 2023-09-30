import db, { sequelize } from "../models";
import { Op } from "sequelize";

export const getNotifications = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.Notification.findAll({
        where: { [Op.and]: [{ userId: userId }, { isWatched: false }] },
        order: [["createdAt", "DESC"]],
      });
      resolve({
        err: response ? true : false,
        message: response ? "Update event successfull" : "not",
        response: response,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
