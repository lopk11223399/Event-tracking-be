import db from "../models";
import { CronJob } from "cron";

export const updateStatusEvent = (eventId, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.Event.update(
        { status: body.status },
        { where: { id: eventId } }
      );
      if (Number(body.status) === 2) {
        const date = await db.Event.findOne({ where: { id: eventId } });
        const job = new CronJob(
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
