import joi from "joi";
import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";

export const getNotifications = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await services.getNotifications(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
