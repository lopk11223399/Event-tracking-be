import joi from "joi";
import * as services from "../services";
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
      return res.status(200).json({
        success: false,
        mess: error.details[0]?.message,
      });
    }
    const response = await services.createUserByAdmin(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const response = await services.getAllUsers(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await services.getUser(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
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
      return res.status(200).json({
        success: false,
        mess: error.details[0]?.message,
      });
    }
    const response = await services.updateUser(req.body, id, fileData);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
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
      return res.status(200).json({
        success: false,
        mess: error.details[0]?.message,
      });
    }
    const response = await services.updateInfoAdmin(req.body, id, fileData);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await services.deleteUserByAdmin(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await services.changePassword(req.body, id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
