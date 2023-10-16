import db, { sequelize } from "../models";
import { Op } from "sequelize";

export const getNotifications = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.Notification.findAll({
        where: { [Op.and]: [{ userId: userId }, { isWatched: false }] },
        attributes: ["isWatched", "createdAt"],
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: db.TypeNotification,
            as: "notiData",
            attributes: ["id", "nameNotification"],
          },
          {
            model: db.Event,
            as: "eventData",
          },
        ],
      });
      resolve({
        success: response ? true : false,
        mess: response ? "Update event successfull" : "not",
        response: response,
      });
    } catch (error) {
      reject(error);
    }
  });
};
