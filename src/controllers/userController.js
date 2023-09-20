import joi from "joi";
import * as services from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";
import {
  username,
  password,
  email,
  name,
  gender,
  birthDate,
  address,
  phone,
  avatar,
  isActive,
  classCode,
  program,
  studentCode,
  facultyCode,
} from "../helpers/joi_schema";
const cloudinary = require("cloudinary").v2;

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
    const { id } = req.user;
    const response = await services.getUser(id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const updateUser = async (req, res) => {
  try {
    const fileData = req.file;
    const { id } = req.user;
    const { error } = joi
      .object({
        email,
        name,
        gender,
        birthDate,
        address,
        phone,
        avatar,
        classCode,
        program,
        studentCode,
        facultyCode,
      })
      .validate({
        ...req.body,
        avatar: fileData?.path,
      });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
      return badRequest(error.details[0].message, res);
    }
    const response = await services.updateUser(req.body, id, fileData);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const updateInfoAdmin = async (req, res) => {
  try {
    const fileData = req.file;
    const { id } = req.user;
    const { error } = joi
      .object({
        email,
        name,
        gender,
        birthDate,
        address,
        phone,
        avatar,
      })
      .validate({
        ...req.body,
        avatar: fileData?.path,
      });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
      return badRequest(error.details[0].message, res);
    }
    const response = await services.updateInfoAdmin(req.body, id, fileData);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.user;
    const { error } = joi
      .object({
        isActive,
      })
      .validate(req.body);
    if (error) {
      return badRequest(error.details[0]?.message, res);
    }
    const response = await services.deleteUser(req.body, id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
