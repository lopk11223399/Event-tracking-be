import db, { sequelize } from "../models";
import { Op } from "sequelize";
import moment from "moment";

export const eventByMonth = ({ year, ...query }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (year) {
        query.startDate = {
          [Op.between]: [moment(year), moment(year).endOf("year")],
        };
      }
      const data = await db.Event.findAll({
        where: query,
      });

      const response = [];
      const months = data.map((event) => {
        return Number(moment(event.dataValues.startDate).format("MM"));
      });
      for (let month = 1; month <= 12; month++) {
        const totalEvent = months.reduce(
          (count, i) => (i === month ? count + 1 : count),
          0
        );
        response.push({ month, totalEvent });
      }

      resolve({
        success: response ? true : false,
        mess: response ? "Get data successfull" : "Đã có lỗi gì đó xảy ra",
        response: response,
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const byGenderOfEvent = (eventId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.ListPeopleJoin.findAll({
        where: {
          [Op.and]: [{ eventId: eventId }, { isJoined: true }],
        },
        include: [
          {
            model: db.User,
            as: "userData",
          },
        ],
      });
      const response = [];

      const gender = data.reduce(
        (acc, item) => {
          if (item.dataValues.userData.gender) {
            acc.female += 1;
          } else {
            acc.male += 1;
          }
          return acc;
        },
        { female: 0, male: 0 }
      );
      response.push({
        gender: "Nữ",
        count: gender.female,
      });
      response.push({
        gender: "Nam",
        count: gender.male,
      });
      resolve({
        success: data ? true : false,
        mess: data ? "Get data successfull" : "Đã có lỗi gì đó xảy ra",
        response: response,
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const byAgeOfEvent = (eventId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.ListPeopleJoin.findAll({
        where: {
          [Op.and]: [{ eventId: eventId }, { isJoined: true }],
        },
        include: [
          {
            model: db.User,
            as: "userData",
          },
        ],
      });

      const ages = data.map((item) => {
        return Number(
          moment(item.dataValues.userData.birthDate).fromNow().slice(0, 2)
        );
      });

      resolve({
        success: data ? true : false,
        mess: data ? "Get data successfull" : "Đã có lỗi gì đó xảy ra",
        response: data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const byFaculty = (eventId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.ListPeopleJoin.findAll({
        where: { eventId: eventId, isJoined: true },
        include: {
          model: db.User,
          as: "userData",
          attributes: ["facultyCode"],
        },
      });
      const response = [];
      const faculties = data.map((event) => {
        return event.dataValues.userData.facultyCode;
      });
      for (let code = 1; code <= 5; code++) {
        const totalFaculty = faculties.reduce(
          (count, i) => (i === code ? count + 1 : count),
          0
        );
        response.push({ code, totalFaculty });
      }
      resolve({
        success: data ? true : false,
        mess: data ? "Get data successfull" : "Đã có lỗi gì đó xảy ra",
        response: response,
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const fivePeopleHot = (authorId, { ...query }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalEvent = await db.Event.findAll({
        where: { authorId: authorId },
        attributes: ["id"],
      });
      const Ids = totalEvent.map((item) => {
        return item.dataValues.id;
      });
      const response = await db.ListPeopleJoin.findAll({
        attributes: [
          "userId",
          [sequelize.fn("COUNT", sequelize.col("eventId")), "eventCount"],
        ],
        where: {
          eventId: {
            [Op.in]: Ids,
          },
          isJoined: true,
        },
        limit: 5,
        group: ["userId"],
        include: [
          {
            model: db.User,
            as: "userData",
            attributes: {
              exclude: [
                "password",
                "username",
                "roleId",
                "refresh_token",
                "fileName",
                "createdAt",
                "updatedAt",
              ],
            },
            include: [
              {
                model: db.Student,
                as: "studentData",
                attributes: ["point"],
              },
            ],
          },
        ],
      });

      resolve({
        success: response ? true : false,
        mess: response ? "Get data successfull" : "Đã có lỗi gì đó xảy ra",
        response: response,
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const totalRateOfAuthor = (authorId, { month, year, ...query }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (year) {
        query.startDate = {
          [Op.between]: [moment(year), moment(year).endOf("year")],
        };
      }
      const data = await db.Event.findAll({
        where: { authorId: authorId, ...query },
      });
      const rates = data.map((item) => {
        return item.dataValues.totalRate;
      });
      console.log(rates);
      const response = [];
      for (let rate = 1; rate <= 5; rate++) {
        const totalRate = rates.reduce(
          (count, i) => (Math.round(i) === rate ? count + 1 : count),
          0
        );
        response.push({ rate, totalRate });
      }

      resolve({
        success: response ? true : false,
        mess: response ? "Get data successfull" : "Not",
        response: response,
      });
    } catch (error) {
      reject(error);
    }
  });
};
