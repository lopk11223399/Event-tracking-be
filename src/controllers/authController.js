import joi from "joi";
import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";
import { username, password, refreshToken } from "../helpers/joi_schema";

export const login = async (req, res) => {
  try {
    const { error } = joi.object({ username, password }).validate(req.body);
    if (error) {
      return badRequest(error.details[0]?.message, res);
    }
    const response = await services.login(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const { error } = joi.object({ refreshToken }).validate(req.body);
    if (error) {
      return badRequest(error.details[0]?.message, res);
    }
    const response = await services.refreshToken(req.body.refreshToken);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
