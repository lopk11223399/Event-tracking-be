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
  location,
} from "../helpers/joi_schema";

export const createEvent = async (req, res) => {
  try {
    const fileData = req.file;
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
        location,
      })
      .validate({
        ...req.body,
        image: fileData?.path,
      });
    console.log(fileData);
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
      return badRequest(error.details[0].message, res);
    }
    const response = await services.createEvent(req.body, id, fileData);
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

export const getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await services.getEvent(id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const cancelEvent = async (req, res) => {
  try {
    const { id } = req.user;
    const { eventId } = req.params;
    const response = await services.cancelEvent(id, Number(eventId));
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const response = await services.deleteEvent(Number(eventId));
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const getEventByUserId = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await services.getEventByUserId(id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const scanQr = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await services.scanQr(id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
