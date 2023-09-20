import joi from "joi";

export const username = joi.string().required().min(6);
export const password = joi.string().required().min(6);
export const email = joi.string().pattern(new RegExp("gmail.com$")).required();
export const name = joi.string().required();
export const address = joi.string().required();
export const phone = joi.string().required().min(10);
export const avatar = joi.string().required();
export const gender = joi.boolean().required();
export const birthDate = joi.string().required();
export const facultyCode = joi.string().required();
export const isActive = joi.number().required().max(1);
export const classCode = joi.string().required();
export const program = joi.string().required();
export const studentCode = joi.string().required();
export const refreshToken = joi.string().required();
