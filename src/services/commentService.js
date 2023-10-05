import db from "../models";

export const postComment = (body, id, eventId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Comment.create({
        userId: id,
        eventId: eventId,
        comment: body.comment,
      });
      resolve({
        err: response ? true : false,
        mess: response
          ? "Bình luận thành công"
          : "Đã xảy ra một lỗi gì đó vui lòng thử lại",
      });
    } catch (e) {
      reject(e);
    }
  });
