import * as services from "../services";

export const insertDataUser = async (req, res) => {
  try {
    const response = await services.insertDataUser();
    return res.status(200).json(response);
  } catch (error) {
    return error;
  }
};

export const insertDataEvent = async (req, res) => {
  try {
    const response = await services.insertDataEvent();
    return res.status(200).json(response);
  } catch (error) {
    return error;
  }
};

export const insertFaculty = async (req, res) => {
  try {
    const response = await services.insertFaculty();
    return res.status(200).json(response);
  } catch (error) {
    return error;
  }
};
