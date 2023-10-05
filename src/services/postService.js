import db, { sequelize } from "../models";
const cloudinary = require("cloudinary").v2;
import { Op } from "sequelize";
import { CronJob } from "cron";

export const createEvent = (body, id, fileData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (fileData) {
        body.image = fileData?.path;
        body.fileNameImage = fileData?.filename;
      }
      const response = await db.Event.create({
        title: body.title,
        authorId: id,
        startDate: body.startDate,
        finishDate: body.finishDate,
        image: body.image,
        description: body.description,
        typeEvent: body.typeEvent,
        status: body.status,
        fileNameImage: body.fileNameImage,
      });
      if (fileData && !response[0] === 0)
        cloudinary.uploader.destroy(fileData.filename);
      const job = new CronJob(
        "1 * * * * *",
        function () {
          cancelEvent(id, response.id);
        },
        null,
        true,
        "Asia/Ho_Chi_Minh"
      );
      resolve({
        err: response ? true : false,
        message: response ? "Created event successfull" : "not",
        response: response,
      });
    } catch (error) {
      reject(error);
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
  });
};

export const updateEvent = (body, eventId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.Event.update(body, {
        where: { id: eventId },
      });
      resolve({
        err: response[0] > 0 ? true : false,
        message: response[0] > 0 ? "Update event successfull" : "not",
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllEvent = ({
  order,
  page,
  limit,
  title,
  status,
  date,
  ...query
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const queries = { raw: true, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.LIMIT_USER;
      queries.offset = offset * fLimit;
      queries.limit = fLimit;
      if (order) queries.order = [order];
      if (title) query.title = { [Op.substring]: title };
      if (date) query.startDate = { [Op.endsWith]: date };
      if (status) {
        let statusess = status.map((item) => Number(item));
        query.status = { [Op.or]: statusess };
      }
      const response = await db.Event.findAll({
        where: query,
        ...queries,
      });

      resolve({
        err: response ? true : false,
        message: response ? "Get data success" : "Get data failure",
        response: response,
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const filterEventHot = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.ListPeopleJoin.findAll({
        attributes: [
          "eventId",
          [sequelize.fn("COUNT", "*"), "total_participants"],
        ],
        group: ["eventId"],
        order: [["total_participants", "DESC"]],
        include: [
          {
            model: db.Event,
            as: "eventData",
            attributes: [
              "id",
              "authorId",
              "title",
              "image",
              "startDate",
              "finishDate",
              "status",
            ],
          },
        ],
      });
      resolve({
        success: response ? true : false,
        mess: response ? "Lấy dữ liệu thành công" : "Có lỗi",
        response: response,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const filterEventToday = () => {
  return new Promise(async (resolve, reject) => {
    try {
      var d = new Date();
      const date =
        ("0" + d.getDate()).slice(-2) +
        "-" +
        ("0" + (d.getMonth() + 1)).slice(-2) +
        "-" +
        d.getFullYear();
      const response = await db.Event.findAndCountAll({
        where: {
          startDate: {
            [Op.startsWith]: date,
          },
        },
        attributes: [
          "id",
          "authorId",
          "title",
          "startDate",
          "finishDate",
          "status",
        ],
      });

      resolve({
        success: 1,
        mess: 2,
        response: response,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const getEvent = (eventId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response1 = await db.Event.findAll({
        where: { id: eventId },
        include: [
          {
            model: db.User,
            as: "author",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.User,
            as: "followers",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.User,
            as: "userJoined",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.Status,
            as: "statusEvent",
            attributes: ["id", "statusName"],
          },
          {
            model: db.User,
            as: "feedback",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.User,
            as: "commentEvent",
            attributes: ["id", "name", "email", "avatar"],
          },
          // Need fix here
          // ---------------------------------------
          {
            model: db.OfflineEvent,
            as: "offlineEvent",
          },
          {
            model: db.OnlineEvent,
            as: "onlineEvent",
          },
          // -------------------------------------
        ],
        attributes: {
          exclude: [
            "authorId",
            "fileNameImage",
            "fileNameQr",
            "updatedAt",
            "status",
          ],
        },
      });
      response1[0].dataValues.followers.forEach((follower) => {
        delete follower.dataValues.ListEventFollow;
      });

      response1[0].dataValues.commentEvent.forEach((comment) => {
        const listComment = comment.dataValues.Comment;

        comment.dataValues.comment = listComment.comment;
        comment.dataValues.createdAt = listComment.createdAt;

        delete comment.dataValues.Comment;
      });

      response1[0].dataValues.feedback.forEach((feedback) => {
        const listFeedback = feedback.dataValues.Feedback;

        feedback.dataValues.rate = listFeedback.rate;
        feedback.dataValues.feedback = listFeedback.feedback;

        delete feedback.dataValues.Feedback;
      });

      response1[0].dataValues.userJoined.forEach((user) => {
        const userJoined = user.dataValues.ListPeopleJoin;

        user.dataValues.roomId = userJoined.roomId;

        delete user.dataValues.ListPeopleJoin;
      });

      resolve({
        success: response1 ? true : false,
        mess: response1 ? "Lấy dữ liệu thành công" : "Có lỗi",
        response1: response1,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const cancelEvent = (userId, eventId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.Event.update(
        { status: 5 },
        {
          where: {
            [Op.and]: [{ authorId: userId }, { id: eventId }, { status: 1 }],
          },
        }
      );
      const people = await db.Event.findAll({
        where: { id: eventId },
        attributes: ["id"],
        include: [
          {
            model: db.ListEventFollow,
            as: "followerData",
            attributes: ["userId"],
          },
          {
            model: db.ListPeopleJoin,
            as: "peopleData",
            attributes: ["userId"],
          },
        ],
      });
      people[0].dataValues.followerData.forEach(async (follower) => {
        await db.ListEventFollow.destroy({
          where: {
            [Op.and]: [
              { UserId: follower.dataValues.userId },
              { EventId: eventId },
            ],
          },
        });
        await db.Notification.create({
          userId: follower.dataValues.userId,
          eventId: eventId,
          notification_code: 1,
          content: "Sự kiện đã bị hủy",
        });
      });
      people[0].dataValues.peopleData.forEach(async (people) => {
        await db.ListPeopleJoin.destroy({
          where: {
            [Op.and]: [
              { UserId: people.dataValues.userId },
              { EventId: eventId },
            ],
          },
        });
        await db.Notification.create({
          userId: people.dataValues.userId,
          eventId: eventId,
          notification_code: 1,
          content: "Sự kiện đã bị hủy",
        });
      });
      resolve({
        success: response ? true : false,
        mess: response ? "Hủy thành công" : "Đã xảy ra lỗi gì đó",
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const deleteEvent = (eventId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.Event.findAll({
        where: { id: eventId },
        attributes: ["id"],
        include: [
          {
            model: db.ListEventFollow,
            as: "followerData",
            attributes: ["userId"],
          },
          {
            model: db.ListPeopleJoin,
            as: "peopleData",
            attributes: ["userId"],
          },
        ],
      });
      const deleteEvent = await db.Event.destroy({ where: { id: eventId } });
      response[0].dataValues.followerData.forEach(async (follower) => {
        await db.ListEventFollow.destroy({
          where: {
            [Op.and]: [
              { UserId: follower.dataValues.userId },
              { EventId: eventId },
            ],
          },
        });
        await db.Notification.create({
          userId: follower.dataValues.userId,
          eventId: eventId,
          notification_code: 1,
          content: "Sự kiện đã bị hủy",
        });
      });
      response[0].dataValues.peopleData.forEach(async (people) => {
        await db.ListPeopleJoin.destroy({
          where: {
            [Op.and]: [
              { UserId: people.dataValues.userId },
              { EventId: eventId },
            ],
          },
        });
        await db.Notification.create({
          userId: people.dataValues.userId,
          eventId: eventId,
          notification_code: 1,
          content: "Sự kiện đã bị hủy",
        });
      });
      resolve({
        success: deleteEvent ? true : false,
        mess: deleteEvent ? "Xóa thành công" : "Có lỗi gì đó đã xảy ra",
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Chưa xong
export const getEventByUserId = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findAll({
        where: { id: userId },
        attributes: {
          exclude: [
            "refresh_token",
            "createdAt",
            "updatedAt",
            "fileName",
            "roleId",
          ],
        },
      });
      resolve({
        success: response ? true : false,
        mess: response ? "Get curent user success" : "Get curent user failure",
        response: response,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
