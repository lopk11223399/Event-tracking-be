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

export const getEvent = ({ status }, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (status) {
        var statusess = status.map((item) => [{ status: Number(item) }]);
      }
      const response = await db.Event.findAll({
        where: {
          creatorId: id,
          ...(status && { [Op.or]: statusess }),
        },
        include: ["statusEvent"],
      });
      resolve({
        err: response ? true : false,
        message: response ? "Got events successfull" : "not",
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

export const getAllEvent = ({ order, ...query }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const queries = { raw: true, nest: true };
      if (order) queries.order = [order];
      const response = await db.Event.findAndCountAll({
        ...queries,
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
      const response = await db.Event.findAll({
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

export const detailEvent = (eventId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response1 = await db.Event.findAll({
        where: { id: eventId },
        attributes: {
          exclude: [
            "creatorId",
            "fileNameImage",
            "fileNameQr",
            "updatedAt",
            "status",
          ],
        },
        include: [
          {
            model: db.User,
            as: "author",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.ListEventFollow,
            as: "follower",
            attributes: ["userId"],
          },
          {
            model: db.ListPeopleJoin,
            as: "userJoined",
            attributes: ["userId"],
          },
          {
            model: db.Status,
            as: "statusEvent",
            attributes: ["id", "statusName"],
          },
          {
            model: db.Feedback,
            as: "feedback",
            attributes: ["userId", "feedback", "createdAt"],
          },
          {
            model: db.Comment,
            as: "commentEvent",
            attributes: ["userId", "comment", "createdAt"],
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
