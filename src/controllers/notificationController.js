import joi from "joi";
import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";

export const getNotifications = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await services.getNotifications(id, req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const updateNotification = async (req, res) => {
  try {
    const { id } = req.user;
    const { eventId } = req.params;
    const response = await services.updateNotification(id, eventId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
