import { Op } from "sequelize";
import db from "../models";

export const createFaculty = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Faculty.create({
        nameFaculty: body.nameFaculty,
      });
      resolve({
        success: response ? true : false,
        mess: response
          ? "Thêm thành công"
          : "Đã xảy ra một lỗi gì đó vui lòng thử lại",
      });
    } catch (e) {
      reject(e);
    }
  });
export const updateFaculty = (body, id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Faculty.update(
        { nameFaculty: body.nameFaculty },
        { where: { id: id } }
      );
      resolve({
        success: response[0] > 0 ? true : false,
        mess:
          response[0] > 0
            ? "Sửa thành công"
            : "Đã xảy ra một lỗi gì đó vui lòng thử lại",
      });
    } catch (e) {
      reject(e);
    }
  });

export const deleteFaculty = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Faculty.destroy({ where: { id: id } });
      resolve({
        success: response ? true : false,
        mess: response
          ? "Xóa thành công"
          : "Đã xảy ra một lỗi gì đó vui lòng thử lại",
      });
    } catch (e) {
      reject(e);
    }
  });

export const getAllFaculty = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Faculty.findAll();
      resolve({
        success: response ? true : false,
        mess: response
          ? "Lấy dữ liệu thành công"
          : "Đã xảy ra một lỗi gì đó vui lòng thử lại",
        response: response,
      });
    } catch (e) {
      reject(e);
    }
  });
