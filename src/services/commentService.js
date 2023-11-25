import { Op } from "sequelize";
import db from "../models";

export const postComment = (body, id) =>
  new Promise(async (resolve, reject) => {
    try {
      if (body.responseId) {
        const response = await db.ResponseComment.create({
          userId: id,
          response: body.comment,
          commentId: body.responseId,
        });
        resolve({
          success: response ? true : false,
          mess: response
            ? "Bình luận thành công"
            : "Đã xảy ra một lỗi gì đó vui lòng thử lại",
        });
      } else {
        const response = await db.Comment.create({
          userId: id,
          eventId: body.eventId,
          comment: body.comment,
        });
        resolve({
          success: response ? true : false,
          mess: response
            ? "Bình luận thành công"
            : "Đã xảy ra một lỗi gì đó vui lòng thử lại",
        });
      }
    } catch (e) {
      reject(e);
    }
  });

export const updateComment = (body, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      if (body.responseId) {
        const response = await db.ResponseComment.update(
          { response: body.comment },
          {
            where: {
              [Op.and]: [{ userId: userId }, { id: body.responseId }],
            },
          }
        );
        resolve({
          success: response[0] > 0 ? true : false,
          mess:
            response[0] > 0
              ? "Cập nhật bình luận thành công"
              : "Đã xảy ra một lỗi gì đó vui lòng thử lại",
        });
      } else {
        const response = await db.Comment.update(
          { comment: body.comment },
          {
            where: { [Op.and]: [{ userId: userId }, { id: body.commentId }] },
          }
        );
        resolve({
          success: response[0] > 0 ? true : false,
          mess:
            response[0] > 0
              ? "Cập nhật bình luận thành công"
              : "Đã xảy ra một lỗi gì đó vui lòng thử lại",
        });
      }
    } catch (e) {
      reject(e);
    }
  });

export const deleteComment = (userId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      if (body.responseId) {
        const response = await db.ResponseComment.destroy({
          where: { [Op.and]: [{ userId: userId }, { id: body.responseId }] },
        });
        resolve({
          success: response ? true : false,
          mess: response
            ? "Xóa bình luận thành công"
            : "Đã xảy ra một lỗi gì đó vui lòng thử lại",
        });
      } else {
        const data = await db.Comment.findOne({
          where: { [Op.and]: [{ userId: userId }, { id: body.commentId }] },
        });
        const response = await db.Comment.destroy({
          where: { [Op.and]: [{ userId: userId }, { id: body.commentId }] },
        });
        if (response) {
          const destroy = await db.ResponseComment.destroy({
            where: { commentId: data.id },
          });
        }
        resolve({
          success: response ? true : false,
          mess: response
            ? "Xóa bình luận thành công"
            : "Đã xảy ra một lỗi gì đó vui lòng thử lại",
        });
      }
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
      reject(e);
    }
  });
