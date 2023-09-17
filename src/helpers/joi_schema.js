import joi from "joi";

export const username = joi.string().required().min(6);
export const password = joi.string().required().min(6);
export const email = joi.string().pattern(new RegExp("gmail.com$")).required();
export const name = joi.string().required();
export const gender = joi.boolean().required();
export const birthDate = joi.string().required();
export const refreshToken = joi.string().required();
