import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";

export const joinEvent = async (req, res) => {
  try {
    const { id } = req.user;
    const { eventId } = req.params;
    const response = await services.joinEvent(id, eventId, req.body.roomId);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { id } = req.user;
    const { eventId } = req.params;
    const response = await services.updateRoom(id, eventId, req.body.roomId);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
