import joi from "joi";
import * as services from "../services";
const cloudinary = require("cloudinary").v2;
import {
  title,
  startDate,
  finishDate,
  image,
  description,
  typeEvent,
  location,
  addPoint,
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
        location,
        addPoint,
      })
      .validate({
        ...req.body,
        image: fileData?.path,
      });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
      return res.status(200).json({
        success: false,
        mess: error.details[0]?.message,
      });
    }
    const response = await services.createEvent(req.body, id, fileData);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await services.updateEvent(req.body, id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const getAllEvent = async (req, res) => {
  try {
    const response = await services.getAllEvent(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await services.getEvent(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const cancelEvent = async (req, res) => {
  try {
    const { id } = req.user;
    const { eventId } = req.params;
    const response = await services.cancelEvent(id, Number(eventId));
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const response = await services.deleteEvent(Number(eventId));
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

// Test;
// export const test = async (req, res) => {
//   try {
//     const response = await services.test();
//     return res.status(200).json(response);
//   } catch (error) {
//     console.log(error);
//   }
// };
