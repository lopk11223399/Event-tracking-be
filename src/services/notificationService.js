import db, { sequelize } from "../models";
import { Op } from "sequelize";

export const getNotifications = (userId, { page, limit, code, ...query }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const queries = { raw: true, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.LIMIT_USER;
      queries.offset = offset * fLimit;
      queries.limit = fLimit;
      if (code) query.notification_code = Number(code);
      const response = await db.Notification.findAll({
        where: { [Op.and]: [{ userId: userId }, query] },
        attributes: ["isWatched", "createdAt", "notification_code"],
        ...queries,
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
        mess: response
          ? "Get Notification successfull"
          : "Đã có lỗi gì đó xảy ra",
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
          mess:
            response[0] > 0
              ? "Cập nhật thông báo thành công"
              : "Đã có lỗi gì đó xảy ra",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
