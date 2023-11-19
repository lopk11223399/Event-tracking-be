import db, { sequelize } from "../models";
import { Op, where } from "sequelize";

export const joinEvent = (userId, eventId, roomId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isCheckFollow = await db.ListEventFollow.findOne({
        where: { userId: userId, eventId: eventId },
      });
      if (isCheckFollow) {
        await db.ListEventFollow.destroy({
          where: { [Op.and]: [{ userId: userId }, { eventId: eventId }] },
        });
      }
      const isJoin = await db.ListPeopleJoin.findOne({
        where: { [Op.and]: [{ userId: userId }, { eventId: eventId }] },
      });
      const checkEvent = await db.Event.findOne({ where: { id: eventId } });
      if (
        checkEvent.dataValues.status !== 4 &&
        checkEvent.dataValues.status !== 5
      ) {
        if (isJoin) {
          const response = await db.ListPeopleJoin.destroy({
            where: { [Op.and]: [{ userId: userId }, { eventId: eventId }] },
          });
          resolve({
            success: response ? true : false,
            mess: response
              ? "Đã hủy than gia sự kiện này"
              : "Đã xảy ra lỗi gì đó vui lòng thử lại",
          });
        } else {
          const response = await db.ListPeopleJoin.create({
            UserId: userId,
            EventId: eventId,
            roomId: roomId,
          });
          resolve({
            success: response ? true : false,
            mess: response
              ? "Đã tham gia sự kiện thành công"
              : "Đã có lỗi gì đó xảy ra",
          });
        }
      } else {
        resolve({
          success: false,
          mess: "Sự kiện đã kết thúc hoặc đã bị hủy",
        });
      }
    } catch (error) {
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
      reject(error);
    }
  });
};
