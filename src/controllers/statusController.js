import * as services from "../services";

export const updateStatusEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const response = await services.updateStatusEvent(eventId, req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
