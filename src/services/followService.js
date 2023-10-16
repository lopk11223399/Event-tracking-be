import db, { sequelize } from "../models";
import { Op } from "sequelize";

export const getAllFollower = (eventId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.ListEventFollow.findAll({
        where: { eventId: eventId },
        // attributes: ["eventId", "userId"],
        // include: [
        //   {
        //     model: db.User,
        //     as: "followers",
        //     attributes: [
        //       "id",
        //       "name",
        //       "gender",
        //       "email",
        //       "birthDate",
        //       "avatar",
        //       "facultyCode",
        //       "phone",
        //     ],
        //   },
        // ],
      });
      resolve({
        err: response ? true : false,
        mess: response ? "Get data success" : "Get data failure",
        response: response,
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllFollowByUserId = (
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
      const response = await db.ListEventFollow.findAndCountAll({
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

export const followEvent = (userId, eventId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isFollow = await db.ListEventFollow.findOne({
        where: { [Op.and]: [{ UserId: userId }, { EventId: eventId }] },
      });
      if (isFollow) {
        const response = await db.ListEventFollow.destroy({
          where: { [Op.and]: [{ UserId: userId }, { EventId: eventId }] },
        });
        resolve({
          success: response ? true : false,
          mess: response
            ? "Đã hủy theo dõi sự kiện này"
            : "Đã xảy ra lỗi gì đó vui lòng thử lại",
        });
      } else {
        const response = await db.ListEventFollow.findOrCreate({
          where: { [Op.and]: [{ UserId: userId }, { EventId: eventId }] },
          defaults: {
            UserId: userId,
            EventId: eventId,
          },
        });
        resolve({
          success: response[0] ? true : false,
          mess: response[0]
            ? "Đã theo dõi sự kiện này thành công"
            : "Đã xảy ra lỗi gì đó vui lòng thử lại",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
