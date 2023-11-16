import db from "../models";
import { CronJob } from "cron";
import { Op } from "sequelize";
import moment from "moment";

export const updateStatusEvent = (eventId, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Event.findOne({ where: { id: eventId } });
      if (data.dataValues.startDate > new Date()) {
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
              updateStartEvent(eventId);
            },
            null,
            true,
            "Asia/Ho_Chi_Minh"
          );
          const finish = new CronJob(
            date.dataValues.finishDate,
            function () {
              notificationFinish(eventId);
              updateFinishEvent(eventId);
              addPoint(eventId);
            },
            null,
            true,
            "Asia/Ho_Chi_Minh"
          );
        }
        resolve({
          success: response[0] > 0 ? true : false,
          mess:
            response[0] > 0
              ? "Cập nhật trạng thái thành công"
              : "Đã có lỗi gì đó xảy ra",
        });
      } else {
        resolve({
          success: false,
          mess: "Không thể cập nhật trạng thái sự kiện",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateStartEvent = async (eventId) => {
  try {
    await db.Event.update({ status: 3 }, { where: { id: eventId } });
  } catch (error) {
    console.log(error);
  }
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

const updateFinishEvent = async (eventId) => {
  try {
    await db.Event.update({ status: 4 }, { where: { id: eventId } });
  } catch (error) {
    console.log(error);
  }
};

const notificationFinish = async (eventId) => {
  try {
    const people = await db.ListPeopleJoin.findAll({
      where: { EventId: eventId },
    });
    people.forEach(async (item) => {
      await db.Notification.create({
        userId: item.dataValues.userId,
        eventId: item.dataValues.eventId,
        notification_code: 5,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const addPoint = async (eventId) => {
  try {
    const people = await db.ListPeopleJoin.findAll({
      where: { [Op.and]: [{ EventId: eventId }, { isJoined: true }] },
    });
    const event = await db.Event.findOne({ where: { id: eventId } });
    people.forEach(async (item) => {
      const student = await db.Student.findOne({
        where: { studentId: item.dataValues.userId },
      });
      if (student) {
        student.dataValues.point += event.dataValues.addPoint;
        await db.Student.update(
          { point: student.dataValues.point },
          { where: { studentId: item.dataValues.userId } }
        );
      }
    });
  } catch (error) {
    console.log(error);
  }
};
