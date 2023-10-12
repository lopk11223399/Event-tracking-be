import * as services from "../services";

export const joinEvent = async (req, res) => {
  try {
    const { id } = req.user;
    const { eventId } = req.params;
    const response = await services.joinEvent(id, eventId, req.body.roomId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { id } = req.user;
    const { eventId } = req.params;
    const response = await services.updateRoom(id, eventId, req.body.roomId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
