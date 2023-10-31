import joi from "joi";
import * as services from "../services";

export const createUserByAdmin = async (req, res) => {
  try {
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
    const { error } = joi.object.validate({ avatar: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
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

    const { error } = joi.object.validate({ avatar: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
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

export const getAllEventByUserId = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await services.getAllEventByUserId(id, req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const updateRole = async (req, res) => {
  try {
    const response = await services.updateRole(req.query, req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
