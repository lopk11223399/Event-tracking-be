import * as services from "../services";
import joi from "joi";
export const createEvent = async (req, res) => {
  try {
    const fileData = req.file;
    const { id } = req.user;
    const { error } = joi.object().validate({ image: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
    const response = await services.createEvent(req.body, id, fileData);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const updateEvent = async (req, res) => {
  try {
    const fileData = req.file;
    const { id } = req.params;
    const { error } = joi.object().validate({ image: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
    const response = await services.updateEvent(req.body, id, fileData);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const getAllEvent = async (req, res) => {
  try {
    const response = await services.getAllEvent(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await services.getEvent(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const cancelEvent = async (req, res) => {
  try {
    const { id } = req.user;
    const { eventId } = req.params;
    const response = await services.cancelEvent(id, Number(eventId));
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const deleteEventByAdminAndCreator = async (req, res) => {
  try {
    const { roleId } = req.user;
    const response = await services.deleteEventByAdminAndCreator(
      roleId,
      req.body
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const scanQR = async (req, res) => {
  try {
    const response = await services.scanQR(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const getAllEventOfAuthor = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await services.getAllEventOfAuthor(id, req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

// Test;
// export const test = async (req, res) => {
//   try {
//     const response = await services.test();
//     return res.status(200).json(response);
//   } catch (error) {
//     console.log(error);
//   }
// };
