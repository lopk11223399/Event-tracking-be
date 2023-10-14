import db from "../models";
import { CronJob } from "cron";

// need fix
export const updateStatusEvent = (eventId, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.Event.update(
        { status: body.status },
        { where: { id: eventId } }
      );
      const date = await db.Event.findOne({ where: { id: eventId } });
      if (Number(body.status) === 2) {
        const start = new CronJob(
          date.dataValues.startDate,
          function () {
            notificationStart(eventId);
            updateStatusEvent(eventId, { status: 3 });
          },
          null,
          true,
          "Asia/Ho_Chi_Minh"
        );
        const finish = new CronJob(
          date.dataValues.finishDate,
          function () {
            updateStatusEvent(eventId, { status: 4 });
          },
          null,
          true,
          "Asia/Ho_Chi_Minh"
        );
      }
      resolve({
        err: response[0] > 0 ? true : false,
        mess:
          response[0] > 0
            ? "Cập nhật trạng thái thành công"
            : "Đã có lỗi gì đó xảy ra",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const notificationStart = async (eventId) => {
  try {
    const people = await db.ListPeopleJoin.findAll({
      where: { EventId: eventId },
    });
    people.forEach(async (item) => {
      await db.Notification.create({
        userId: item.dataValues.userId,
        eventId: item.dataValues.eventId,
        notification_code: 4,
      });
    });
  } catch (error) {
    console.log(error);
  }
};
