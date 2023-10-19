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

export const updateNotification = (userId, eventId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkWatched = await db.Notification.findAll({
        where: { userId: userId, eventId: eventId },
      });
      if (checkWatched[0].dataValues.isWatched === false) {
        const response = await db.Notification.update(
          { isWatched: true },
          { where: { userId: userId, eventId: eventId } }
        );
        resolve({
          success: response[0] > 0 ? true : false,
          mess: response[0] > 0 ? "Update notification successfull" : "not",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
