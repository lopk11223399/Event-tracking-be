import * as services from "../services";
import joi from "joi";
import { status } from "../helpers/joi_schema.js";

export const updateStatusEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { error } = joi.object({ status }).validate(req.body);
    if (error)
      return res
        .status(200)
        .json({ success: false, mess: error.details[0]?.message });
    const response = await services.updateStatusEvent(eventId, req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
