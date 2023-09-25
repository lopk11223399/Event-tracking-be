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
      // if (status) {
      //   var statusess = status.map((item) => [{ status: Number(item) }]);
      // }
      // const response = await db.Event.findAll({
      //   where: {
      //     creatorId: id,
      //     ...(status && { [Op.or]: statusess }),
      //   },
      //   include: ["statusEvent", "categoryData"],
      // });
      const response = await db.ListEventJoin.findAndCountAll({
        include: ["eventData"],
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
