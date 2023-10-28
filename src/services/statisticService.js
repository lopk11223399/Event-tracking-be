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
        mess: response ? "Get data successfull" : "Not",
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
        mess: data ? "Get data successfull" : "Not",
        response: response,
      });
    } catch (error) {
      reject(error);
    }
  });
};
