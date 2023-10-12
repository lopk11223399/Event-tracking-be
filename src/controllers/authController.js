import joi from "joi";
import * as services from "../services";
import {
  username,
  password,
  refreshToken,
  email,
  name,
} from "../helpers/joi_schema";

export const register = async (req, res) => {
  try {
    const { error } = joi
      .object({ username, password, email, name })
      .validate(req.body);
    if (error) {
      return res.status(200).json({
        success: false,
        mess: error.details[0]?.message,
      });
    }
    const response = await services.register(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { error } = joi.object({ username, password }).validate(req.body);
    if (error) {
      return res.status(200).json({
        success: false,
        mess: error.details[0]?.message,
      });
    }
    const response = await services.login(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const { error } = joi.object({ refreshToken }).validate(req.body);
    if (error) {
      return res.status(200).json({
        success: false,
        mess: error.details[0]?.message,
      });
    }
    const response = await services.refreshToken(req.body.refreshToken);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { error } = joi.object({ email }).validate(req.body);
    if (error) {
      return res.status(200).json({
        success: false,
        mess: error.details[0]?.message,
      });
    }
    const response = await services.resetPassword(req.body.email);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
