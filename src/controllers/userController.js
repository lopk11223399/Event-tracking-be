import joi from "joi";
import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";
import { username, password } from "../helpers/joi_schema";

export const createUserByAdmin = async (req, res) => {
  try {
    const { error } = joi.object({ username, password }).validate(req.body);
    if (error) {
      return badRequest(error.details[0]?.message, res);
    }
    const response = await services.createUserByAdmin(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const response = await services.getAllUsers();
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const getUser = async (req, res) => {
  try {
    const query = req.params;
    const response = await services.getUser(query.id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
