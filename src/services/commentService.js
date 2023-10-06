import { Op } from "sequelize";
import db from "../models";

export const postComment = (body, id, eventId) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log(body, id, eventId);
      const response = await db.Comment.create({
        UserId: id,
        EventId: eventId,
        comment: body.comment,
      });
      resolve({
        success: response ? true : false,
        mess: response
          ? "Bình luận thành công"
          : "Đã xảy ra một lỗi gì đó vui lòng thử lại",
      });
    } catch (e) {
      reject(e);
    }
  });

export const updateComment = (body, id, eventId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Comment.update(
        { comment: body.comment },
        {
          where: { [Op.and]: [{ userId: id }, { eventId: eventId }] },
        }
      );
      resolve({
        success: response[0] > 0 ? true : false,
        mess:
          response[0] > 0
            ? "Cập nhật bình luận thành công"
            : "Đã xảy ra một lỗi gì đó vui lòng thử lại",
      });
    } catch (e) {
      reject(e);
    }
  });

export const deleteComment = (id, eventId) =>
  new Promise(async (resolve, reject) => {
    try {
      const findIdComment = await db.Comment.findAll({
        where: { [Op.and]: [{ userId: id }, { eventId: eventId }] },
        attributes: ["id"],
      });
      const response = await db.Comment.destroy({
        where: { [Op.and]: [{ userId: id }, { eventId: eventId }] },
      });
      const destroy = await db.ResponseComment.destroy({
        where: { commentId: findIdComment[0].dataValues.id },
      });
      resolve({
        success: response ? true : false,
        mess: response
          ? "Xóa bình luận thành công"
          : "Đã xảy ra một lỗi gì đó vui lòng thử lại",
      });
    } catch (e) {
      reject(e);
    }
  });

export const responseComment = (body, id, commentId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.ResponseComment.create({
        userId: id,
        response: body.response,
        commentId: commentId,
      });
      resolve({
        success: response ? true : false,
        mess: response
          ? "Bình luận thành công"
          : "Đã xảy ra một lỗi gì đó vui lòng thử lại",
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
