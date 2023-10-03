import { internalServerError, badRequest } from "../middlewares/handle_errors";
import * as services from "../services";

export const getAllFollower = async (req, res) => {
  try {
    const { eventId } = req.params;
    const response = await services.getAllFollower(eventId);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const followEvent = async (req, res) => {
  try {
    const { id } = req.user;
    const { eventId } = req.params;
    const response = await services.followEvent(id, Number(eventId));
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
