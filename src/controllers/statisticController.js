import * as services from "../services";

export const eventByMonth = async (req, res) => {
  try {
    const response = await services.eventByMonth(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const byGenderOfEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const response = await services.byGenderOfEvent(eventId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const byAgeOfEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const response = await services.byAgeOfEvent(eventId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const byFaculty = async (req, res) => {
  try {
    const { eventId } = req.params;
    const response = await services.byFaculty(eventId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const fivePeopleHot = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await services.fivePeopleHot(id, req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const totalRateOfAuthor = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await services.totalRateOfAuthor(id, req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
