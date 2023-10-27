import db, { sequelize } from "../models";
import { Op } from "sequelize";
import moment from "moment";

export const eventByMonth = ({ limit, page, year, ...query }) => {
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
        success: true,
        mess: "Update event successfull",
        response: response,
      });
    } catch (error) {
      reject(error);
    }
  });
};
