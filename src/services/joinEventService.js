import db, { sequelize } from "../models";
import { Op, where } from "sequelize";

export const joinEvent = (userId, eventId, roomId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deleteEventFollow = await db.ListEventFollow.destroy({
        where: { [Op.and]: [{ userId: userId }, { eventId: eventId }] },
      });
      const isJoin = await db.ListPeopleJoin.findOne({
        where: { [Op.and]: [{ userId: userId }, { eventId: eventId }] },
      });
      if (isJoin) {
        const response = await db.ListPeopleJoin.destroy({
          where: { [Op.and]: [{ userId: userId }, { eventId: eventId }] },
        });
        resolve({
          success: response ? true : false,
          message: response
            ? "Đã hủy than gia sự kiện này"
            : "Đã xảy ra lỗi gì đó vui lòng thử lại",
        });
      } else {
        const response = await db.ListPeopleJoin.create({
          UserId: userId,
          EventId: eventId,
          roomId: roomId ? roomId : 1,
        });
        resolve({
          success: response ? true : false,
          message: response
            ? "Đã tham gia sự kiện thành công"
            : "Đã có lỗi gì đó xảy ra",
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const updateRoom = (userId, eventId, roomId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.ListPeopleJoin.update(
        {
          roomId: roomId ? roomId : 1,
        },
        {
          where: { [Op.and]: [{ userId: userId }, { eventId: eventId }] },
        }
      );
      resolve({
        success: response[0] ? true : false,
        mess: response[0] ? "Cập nhật thành công" : "Đã có lỗi gì đó xảy ra",
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
