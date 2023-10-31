import * as services from "../services";
export const register = async (req, res) => {
  try {
    const response = await services.register(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const response = await services.login(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const response = await services.refreshToken(req.body.refreshToken);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const response = await services.resetPassword(req.body.email);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
