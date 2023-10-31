import joi from "joi";
import * as services from "../services";
import { comment } from "../helpers/joi_schema";

export const postComment = async (req, res) => {
  try {
    const { id } = req.user;
    const { eventId } = req.params;
    const response = await services.postComment(req.body, id, eventId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id } = req.user;
    const { eventId } = req.params;
    const response = await services.updateComment(req.body, id, eventId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.user;
    const { eventId } = req.params;
    const response = await services.deleteComment(id, eventId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const responseComment = async (req, res) => {
  try {
    const { id } = req.user;
    const { commentId } = req.params;
    const response = await services.responseComment(req.body, id, commentId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
