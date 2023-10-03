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
        message: response ? "Get data success" : "Get data failure",
        response: response,
      });
    } catch (error) {
      console.log(error);
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
        console.log(response);
        resolve({
          err: response ? true : false,
          message: response
            ? "Đã hủy theo dõi sự kiện này"
            : "Đã xảy ra lỗi gì đó vui lòng thử lại",
        });
      } else {
        const response = await db.ListEventFollow.findOrCreate({
          where: { EventId: eventId },
          defaults: {
            UserId: userId,
            EventId: eventId,
          },
        });
        resolve({
          err: response[1] ? true : false,
          message: response[1]
            ? "Đã theo dõi sự kiện này thành công"
            : "Đã xảy ra lỗi gì đó vui lòng thử lại",
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
