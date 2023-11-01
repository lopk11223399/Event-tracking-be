import * as services from "../services";

export const eventByMonth = async (req, res) => {
  try {
    const response = await services.eventByMonth(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const byGenderOfEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const response = await services.byGenderOfEvent(eventId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const byAgeOfEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const response = await services.byAgeOfEvent(eventId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
