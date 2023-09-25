import joi from "joi";
import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";
const cloudinary = require("cloudinary").v2;
import {
  title,
  startDate,
  finishDate,
  image,
  description,
  typeEvent,
  status,
  categoryEvent,
} from "../helpers/joi_schema";

export const createEvent = async (req, res) => {
  try {
    const { id } = req.user;
    const { error } = joi
      .object({
        title,
        startDate,
        finishDate,
        image,
        description,
        typeEvent,
        status,
        categoryEvent,
      })
      .validate(req.body);
    console.log(req.body);
    if (error) {
      return badRequest(error.details[0].message, res);
    }
    const response = await services.createEvent(req.body, id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const getEvent = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await services.getEvent(req.query, id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await services.updateEvent(req.body, id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
