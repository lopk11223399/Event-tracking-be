import * as services from "../services";

// chưa code
export const eventByMonth = async (req, res) => {
  try {
    const response = await services.eventByMonth(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
