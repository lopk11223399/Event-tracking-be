import { internalServerError, badRequest } from "../middlewares/handle_errors";
import * as services from "../services";
import joi from "joi";

import { nameFaculty } from "../helpers/joi_schema";

export const createFaculty = async (req, res) => {
  try {
    const { error } = joi.object({ nameFaculty }).validate(req.body);
    if (error) {
      return badRequest(error.details[0].message, res);
    }
    const response = await services.createFaculty(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = joi.object({ nameFaculty }).validate(req.body);
    if (error) {
      return badRequest(error.details[0].message, res);
    }
    const response = await services.updateFaculty(req.body, id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await services.deleteFaculty(id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const getAllFaculty = async (req, res) => {
  try {
    const response = await services.getAllFaculty();
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
