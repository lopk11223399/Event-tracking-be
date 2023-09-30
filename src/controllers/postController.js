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

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await services.updateEvent(req.body, id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const getAllEvent = async (req, res) => {
  try {
    const response = await services.getAllEvent(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const filterEventHot = async (req, res) => {
  try {
    const response = await services.filterEventHot();
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const filterEventToday = async (req, res) => {
  try {
    const response = await services.filterEventToday();
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await services.getEvent(id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

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
