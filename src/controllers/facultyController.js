import * as services from "../services";
import joi from "joi";

import { nameFaculty } from "../helpers/joi_schema";

export const createFaculty = async (req, res) => {
  try {
    const { error } = joi.object({ nameFaculty }).validate(req.body);
    if (error) {
      return res.status(200).json({
        success: false,
        mess: error.details[0]?.message,
      });
    }
    const response = await services.createFaculty(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = joi.object({ nameFaculty }).validate(req.body);
    if (error) {
      return res.status(200).json({
        success: false,
        mess: error.details[0]?.message,
      });
    }
    const response = await services.updateFaculty(req.body, id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await services.deleteFaculty(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const getAllFaculty = async (req, res) => {
  try {
    const response = await services.getAllFaculty();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
