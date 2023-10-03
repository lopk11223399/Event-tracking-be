import joi from "joi";

export const username = joi.string().required().min(8);
export const password = joi.string().required().min(8);
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

export const title = joi.string().required();
export const creatorId = joi.number().required();
export const startDate = joi.string().required();
export const finishDate = joi.string().required();
export const image = joi.string().required();
export const description = joi.string().required();
export const typeEvent = joi.number().required();
export const status = joi.number().required();
export const categoryEvent = joi.number().required();

export const comment = joi.string().required().min(8);
