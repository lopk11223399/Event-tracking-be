import joi from "joi";

export const username = joi.string().required().min(8);
export const password = joi.string().required().min(8);
export const email = joi.string().pattern(new RegExp("gmail.com$"));
export const name = joi.string();
export const address = joi.string();
export const phone = joi.string().min(10);
export const avatar = joi.string();
export const gender = joi.boolean();
export const birthDate = joi.string();
export const facultyCode = joi.string();
export const classCode = joi.string();
export const program = joi.string();
export const studentCode = joi.string();
export const refreshToken = joi.string();

export const title = joi.string();
export const creatorId = joi.number();
export const startDate = joi.string();
export const finishDate = joi.string();
export const image = joi.string();
export const description = joi.string();
export const typeEvent = joi.boolean();
export const location = joi.string();
export const rooms = joi.array();

export const comment = joi.string().min(8);

export const nameFaculty = joi.string();
