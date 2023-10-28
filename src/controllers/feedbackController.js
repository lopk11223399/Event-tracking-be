import * as services from "../services";

export const createFeedback = async (req, res) => {
  try {
    const { id } = req.user;
    const { eventId } = req.params;
    const response = await services.createFeedback(eventId, id, req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.user;
    const { eventId } = req.params;
    const response = await services.updateFeedback(eventId, id, req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
