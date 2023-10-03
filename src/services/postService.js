import db, { sequelize } from "../models";
const cloudinary = require("cloudinary").v2;
import { Op } from "sequelize";

export const createEvent = (body, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.Event.create({
        title: body.title,
        creatorId: id,
        startDate: body.startDate,
        finishDate: body.finishDate,
        image: body.image,
        description: body.description,
        typeEvent: body.typeEvent,
        status: body.status,
        categoryEvent: body.categoryEvent,
      });
      resolve({
        err: response ? true : false,
        message: response ? "Created event successfull" : "not",
        response: response,
      });
    } catch (error) {
      console.log(error);
      reject(error);
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
      console.log(query);
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
              "creatorId",
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
          "creatorId",
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
          {
            model: db.OfflineEvent,
            as: "offlineEvent",
          },
          {
            model: db.OnlineEvent,
            as: "onlineEvent",
          },
        ],
        attributes: {
          exclude: [
            "creatorId",
            "fileNameImage",
            "fileNameQr",
            "updatedAt",
            "status",
          ],
        },
      });
      const event = response1;
      event[0].dataValues.followers.forEach((follower) => {
        delete follower.dataValues.ListEventFollow;
      });

      event[0].dataValues.commentEvent.forEach((comment) => {
        const listComment = comment.dataValues.Comment;

        comment.dataValues.comment = listComment.comment;
        comment.dataValues.createdAt = listComment.createdAt;

        delete comment.dataValues.Comment;
      });

      event[0].dataValues.feedback.forEach((feedback) => {
        const listFeedback = feedback.dataValues.Feedback;

        feedback.dataValues.rate = listFeedback.rate;
        feedback.dataValues.feedback = listFeedback.feedback;

        delete feedback.dataValues.Feedback;
      });

      event[0].dataValues.userJoined.forEach((user) => {
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
          where: { [Op.and]: [{ creatorId: userId }, { id: eventId }] },
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
      for (const person of people) {
        for (const follower of person.followerData) {
          await db.ListEventFollow.destroy({
            where: {
              [Op.and]: [{ UserId: follower.userId }, { EventId: eventId }],
            },
          });
        }
      }
      for (const person of people) {
        for (const join of person.peopleData) {
          await db.ListPeopleJoin.destroy({
            where: {
              [Op.and]: [{ UserId: join.userId }, { EventId: eventId }],
            },
          });
        }
      }
      resolve({
        success: response ? true : false,
        mess: response ? "Hủy thành công" : "Đã xảy ra lỗi gì đó",
        people: people,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
