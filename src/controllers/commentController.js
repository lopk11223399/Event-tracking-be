import joi from "joi";
import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";
import { comment } from "../helpers/joi_schema";

export const postComment = async (req, res) => {
  try {
    const { id } = req.user;
    const { eventId } = req.params;
    const { error } = joi.object({ comment }).validate(req.body);
    if (error) {
      return badRequest(error.details[0].message, res);
    }
    const response = await services.postComment(req.body, id, eventId);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
