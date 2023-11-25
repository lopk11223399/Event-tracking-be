import db, { sequelize } from "../models";
const cloudinary = require("cloudinary").v2;
import { Op } from "sequelize";
import { CronJob } from "cron";
const qrCode = require("qrcode");
import moment from "moment";

export const createEvent = (body, id, fileData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (fileData) {
        body.image = fileData?.path;
        body.fileNameImage = fileData?.filename;
      }

      const response = await db.Event.create({
        ...body,
        status: 1,
        authorId: id,
      });
      if (fileData && !response[0] === 0)
        cloudinary.uploader.destroy(fileData.filename);

      if (response) {
        const listAdmin = await db.User.findAll({
          where: { roleId: 1 },
        });

        listAdmin.forEach(async (user) => {
          await db.Notification.create({
            userId: user.dataValues.id,
            eventId: response.dataValues.id,
            notification_code: 6, //Need define
          });
        });

        const job = new CronJob(
          response.dataValues.startDate,
          function () {
            cancelEvent(id, response.id);
          },
          null,
          true,
          "Asia/Ho_Chi_Minh"
        );
        createRoom(
          response.dataValues.id,
          JSON.parse(body.rooms),
          // body.rooms,
          response.dataValues.typeEvent
        );
      }
      resolve({
        success: response ? true : false,
        mess: response ? "Tạo sự kiện thành công" : "Đã có lỗi gì đó xảy ra",
        response: response,
      });
    } catch (error) {
      reject(error);
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
  });
};

const createRoom = async (eventId, rooms, typeEvent) => {
  try {
    let roomID = 0;
    if (typeEvent === false) {
      if (rooms.length === 0) {
        const response = await db.OfflineEvent.create({
          eventId: eventId,
          roomId: roomID + 1,
        });
        qrCode.toDataURL(
          JSON.stringify({
            eventId: eventId,
            roomId: response.dataValues.roomId,
          }),
          function (err, url) {
            db.OfflineEvent.update(
              { qrCode: url },
              {
                where: {
                  eventId: eventId,
                  roomId: response.dataValues.roomId,
                },
              }
            );
          }
        );
      } else {
        rooms.forEach(async (room) => {
          roomID++;
          const response = await db.OfflineEvent.create({
            eventId: eventId,
            roomId: roomID,
            topic: room.topic,
            numberRoom: room.numberRoom,
            timeRoom: room.timeRoom,
          });
          qrCode.toDataURL(
            JSON.stringify({
              eventId: eventId,
              roomId: response.dataValues.roomId,
            }),
            function (err, url) {
              db.OfflineEvent.update(
                { qrCode: url },
                {
                  where: {
                    eventId: eventId,
                    roomId: response.dataValues.roomId,
                  },
                }
              );
            }
          );
        });
      }
    } else {
      if (rooms.length === 0) {
        const response = await db.OnlineEvent.create({
          eventId: eventId,
          roomId: roomID + 1,
        });
        qrCode.toDataURL(
          JSON.stringify({
            eventId: eventId,
            roomId: response.dataValues.roomId,
          }),
          function (err, url) {
            db.OnlineEvent.update(
              { qrCode: url },
              {
                where: {
                  eventId: eventId,
                  roomId: response.dataValues.roomId,
                },
              }
            );
          }
        );
      } else {
        rooms.forEach(async (room) => {
          roomID++;
          const response = await db.OnlineEvent.create({
            eventId: eventId,
            roomId: roomID,
            topic: room.topic,
            linkRoomUrl: room.linkRoomUrl,
            timeRoom: room.timeRoom,
          });
          qrCode.toDataURL(
            JSON.stringify({
              eventId: eventId,
              roomId: response.dataValues.roomId,
            }),
            function (err, url) {
              db.OnlineEvent.update(
                { qrCode: url },
                {
                  where: {
                    eventId: eventId,
                    roomId: response.dataValues.roomId,
                  },
                }
              );
            }
          );
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateEvent = (body, eventId, fileData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Event.findAll({
        where: { id: eventId },
      });
      if (data)
        cloudinary.api.delete_resources(data[0].dataValues.fileNameImage);

      if (fileData) {
        body.image = fileData?.path;
        body.fileNameImage = fileData?.filename;
      }
      const response = await db.Event.update(body, {
        where: { id: eventId },
      });
      if (response[0] > 0) {
        updateRoom(
          eventId,
          JSON.parse(body.rooms),
          data[0].dataValues.typeEvent
        );
      }
      resolve({
        success: response[0] > 0 ? true : false,
        mess:
          response[0] > 0
            ? "Cập nhật sự kiện thành công"
            : "Đã có lỗi gì đó xảy ra",
      });
      if (fileData && !response[0] === 0)
        cloudinary.uploader.destroy(fileData.filename);
    } catch (error) {
      reject(error);
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
  });
};

const updateRoom = async (eventId, rooms, typeEvent) => {
  if (typeEvent === false) {
    await db.OfflineEvent.destroy({
      where: { eventId: eventId },
    });
  } else {
    await db.OnlineEvent.destroy({
      where: { eventId: eventId },
    });
  }
  createRoom(eventId, rooms, typeEvent);
};

export const getAllEvent = ({
  order,
  page,
  limit,
  title,
  status,
  date,
  hot,
  ...query
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const queries = { raw: false, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.LIMIT_USER;
      queries.distinct = true;
      if (limit) {
        queries.offset = offset * fLimit;
        queries.limit = fLimit;
      }
      if (order) queries.order = [order];
      if (title) query.title = { [Op.substring]: title };
      if (status) {
        let statusess = status.map((item) => Number(item));
        query.status = { [Op.or]: statusess };
      }
      if (hot) {
        const hotEvent = await db.ListPeopleJoin.findAll({
          attributes: [
            "eventId",
            [sequelize.fn("COUNT", "*"), "total_participants"],
          ],
          group: ["eventId"],
          order: [["total_participants", "DESC"]],
        });
        let id = hotEvent.map((item) => item.dataValues.eventId);
        query.id = { [Op.or]: id };
      }
      if (date) {
        const data = await db.Event.findAll();
        const ids = [];
        data.forEach((event) => {
          if (
            moment(event.dataValues.startDate).format("YYYY-MM-DD") <=
              moment(date).format("YYYY-MM-DD") &&
            moment(event.dataValues.finishDate).format("YYYY-MM-DD") >=
              moment(date).format("YYYY-MM-DD")
          ) {
            ids.push(event.dataValues.id);
          }
        });
        query.id = { [Op.or]: ids };
      }
      const response = await db.Event.findAndCountAll({
        where: query,
        ...queries,
        include: [
          {
            model: db.User,
            as: "author",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.User,
            as: "followers",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.User,
            as: "userJoined",
            attributes: ["id", "name", "email", "avatar"],
          },
          // {
          //   model: db.User,
          //   as: "commentEvent",
          //   attributes: ["id", "name", "email", "avatar"],
          //   include: [
          //     {
          //       model: db.ResponseComment,
          //       as: "responseData",
          //       attributes: ["response", "commentId", "createdAt", "userId"],
          //       include: [
          //         {
          //           model: db.User,
          //           as: "userData",
          //         },
          //       ],
          //     },
          //   ],
          // },
          {
            model: db.OfflineEvent,
            as: "offlineEvent",
          },
          {
            model: db.OnlineEvent,
            as: "onlineEvent",
          },
        ],
        attributes: {
          exclude: ["fileNameImage", "updatedAt"],
        },
      });
      response.rows.forEach((event) => {
        event.dataValues.onlineEvent.length === 0
          ? (event.dataValues.onlineEvent = null)
          : event.dataValues.onlineEvent;

        event.dataValues.offlineEvent.length === 0
          ? (event.dataValues.offlineEvent = null)
          : event.dataValues.offlineEvent;
      });

      response.rows.forEach((event) => {
        event.dataValues.followers.forEach((follower) => {
          delete follower.dataValues.ListEventFollow;
        });
      });

      // response.rows.forEach((event) => {
      //   event.dataValues.commentEvent.forEach((comment) => {
      //     const listComment = comment.dataValues.Comment;
      //     const listResponse = comment.dataValues.responseData.userData;

      //     comment.dataValues.comment = listComment.comment;
      //     comment.dataValues.createdAt = listComment.createdAt;

      //     comment.dataValues.responseData.dataValues.name = listResponse.name;
      //     comment.dataValues.responseData.dataValues.avatar =
      //       listResponse.avatar;
      //     comment.dataValues.responseData.dataValues.email = listResponse.email;

      //     delete comment.dataValues.Comment;
      //     delete comment.dataValues.responseData.dataValues.userData;
      //   });
      // });

      response.rows.forEach((event) => {
        event.dataValues.userJoined.forEach((user) => {
          const userJoined = user.dataValues.ListPeopleJoin;
          user.dataValues.roomId = userJoined.roomId;

          delete user.dataValues.ListPeopleJoin;
        });
      });
      resolve({
        success: response ? true : false,
        mess: response ? "Get data success" : "Get data failure",
        response: response.rows,
        count: response.count,
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getEvent = (eventId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.Event.findOne({
        where: { id: eventId },
        include: [
          {
            model: db.User,
            as: "author",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.User,
            as: "followers",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.User,
            as: "userJoined",
            attributes: ["id", "name", "birthDate", "facultyCode"],
            include: [
              {
                model: db.Student,
                as: "studentData",
                attributes: ["studentCode", "classCode"],
              },
              {
                model: db.Faculty,
                as: "facultyData",
                attributes: ["nameFaculty"],
              },
            ],
          },
          {
            model: db.Status,
            as: "statusEvent",
            attributes: ["id", "statusName"],
          },
          {
            model: db.User,
            as: "feedback",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.Comment,
            as: "comments",
            attributes: ["id", "comment", "createdAt"],
            include: [
              {
                model: db.User,
                as: "userData",
                attributes: ["id", "name", "email", "avatar"],
              },
              {
                model: db.ResponseComment,
                as: "responseComment",
                attributes: ["id", "response", "createdAt"],
                include: [
                  {
                    model: db.User,
                    as: "userData",
                    attributes: ["id", "name", "email", "avatar"],
                  },
                ],
              },
            ],
          },
          {
            model: db.OfflineEvent,
            as: "offlineEvent",
          },
          {
            model: db.OnlineEvent,
            as: "onlineEvent",
          },
        ],
        attributes: {
          exclude: [
            "authorId",
            "fileNameImage",
            "fileNameQr",
            "updatedAt",
            "status",
          ],
        },
      });
      response.dataValues.onlineEvent.length === 0
        ? (response.dataValues.onlineEvent = null)
        : response.dataValues.onlineEvent;
      response.dataValues.offlineEvent.length === 0
        ? (response.dataValues.offlineEvent = null)
        : response.dataValues.offlineEvent;

      response.dataValues.followers.forEach((follower) => {
        delete follower.dataValues.ListEventFollow;
      });

      response.dataValues.comments.forEach((comment) => {
        const userData = comment.dataValues.userData;

        comment.dataValues.name = userData.name;
        comment.dataValues.userId = userData.id;
        comment.dataValues.avatar = userData.avatar;
        comment.dataValues.email = userData.email;

        delete comment.dataValues.userData;

        if (comment.dataValues.responseComment.length > 0) {
          comment.dataValues.responseComment.forEach((response) => {
            const responseData = response.dataValues.userData;

            response.dataValues.userId = responseData.id;
            response.dataValues.name = responseData.name;
            response.dataValues.avatar = responseData.avatar;
            response.dataValues.email = responseData.email;

            delete response.dataValues.userData;
          });
        }
      });

      response.dataValues.feedback.forEach((feedback) => {
        const listFeedback = feedback.dataValues.Feedback;

        feedback.dataValues.rate = listFeedback.rate;
        feedback.dataValues.feedback = listFeedback.feedback;

        delete feedback.dataValues.Feedback;
      });

      response.dataValues.userJoined.forEach((user) => {
        const userJoined = user.dataValues.ListPeopleJoin;
        const student = user.dataValues.studentData;
        const faculty = user.dataValues.facultyData;

        user.dataValues.studentCode = student.studentCode;
        user.dataValues.classCode = student.classCode;

        user.dataValues.nameFaculty = faculty.nameFaculty;

        user.dataValues.isJoined = userJoined.isJoined;
        user.dataValues.roomId = userJoined.roomId;

        delete user.dataValues.studentData;
        delete user.dataValues.facultyData;
        delete user.dataValues.ListPeopleJoin;
      });

      resolve({
        success: response ? true : false,
        mess: response ? "Lấy dữ liệu thành công" : "Có lỗi",
        response: response,
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const cancelEvent = (authorId, eventId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.Event.update(
        { status: 5 },
        {
          where: {
            [Op.and]: [{ authorId: authorId }, { id: eventId }, { status: 1 }],
          },
        }
      );
      if (response[0] > 0) {
        const people = await db.Event.findAll({
          where: { id: eventId },
          attributes: ["id"],
          include: [
            {
              model: db.ListEventFollow,
              as: "followerData",
              attributes: ["userId"],
            },
            {
              model: db.ListPeopleJoin,
              as: "peopleData",
              attributes: ["userId"],
            },
          ],
        });
        people[0].dataValues.followerData.forEach(async (follower) => {
          await db.ListEventFollow.destroy({
            where: {
              [Op.and]: [
                { UserId: follower.dataValues.userId },
                { EventId: eventId },
              ],
            },
          });
          await db.Notification.create({
            userId: follower.dataValues.userId,
            eventId: eventId,
            notification_code: 1,
          });
        });
        people[0].dataValues.peopleData.forEach(async (people) => {
          await db.ListPeopleJoin.destroy({
            where: {
              [Op.and]: [
                { UserId: people.dataValues.userId },
                { EventId: eventId },
              ],
            },
          });
          await db.Notification.create({
            userId: people.dataValues.userId,
            eventId: eventId,
            notification_code: 1,
            content: "Sự kiện đã bị hủy",
          });
        });
      }
      resolve({
        success: response[0] > 0 ? true : false,
        mess: response[0] > 0 ? "Hủy thành công" : "Đã xảy ra lỗi gì đó",
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteEventByAdminAndCreator = (roleId, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const Ids = body.eventIds;

      Ids.forEach(async (eventId) => {
        const data = await db.Event.findAll({
          where: { id: Number(eventId) },
          attributes: ["id", "authorId"],
          include: [
            {
              model: db.ListEventFollow,
              as: "followerData",
              attributes: ["userId"],
            },
            {
              model: db.ListPeopleJoin,
              as: "peopleData",
              attributes: ["userId"],
            },
          ],
        });
        const deleteEvent = await db.Event.destroy({
          where: { id: Number(eventId) },
        });
        if (roleId === 1) {
          await db.Notification.create({
            userId: data[0].dataValues.authorId,
            eventId: Number(eventId),
            notification_code: 1,
            content: "Sự kiện đã bị hủy",
          });
        }
        data[0].dataValues.followerData.forEach(async (follower) => {
          await db.ListEventFollow.destroy({
            where: {
              [Op.and]: [
                { UserId: follower.dataValues.userId },
                { EventId: Number(eventId) },
              ],
            },
          });
          await db.Notification.create({
            userId: follower.dataValues.userId,
            eventId: Number(eventId),
            notification_code: 1,
            content: "Sự kiện đã bị hủy", // cần xem lại cái này có cần thiết không
          });
        });
        data[0].dataValues.peopleData.forEach(async (people) => {
          await db.ListPeopleJoin.destroy({
            where: {
              [Op.and]: [
                { UserId: people.dataValues.userId },
                { EventId: Number(eventId) },
              ],
            },
          });
          await db.Notification.create({
            userId: people.dataValues.userId,
            eventId: Number(eventId),
            notification_code: 1,
            content: "Sự kiện đã bị hủy",
          });
        });

        resolve({
          success: deleteEvent ? true : false,
          mess: deleteEvent ? "Xóa thành công" : "Có lỗi gì đó đã xảy ra",
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const scanQR = (body, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isCheckStatus = await db.Event.findOne({
        where: { id: body.eventId },
        attributes: ["status"],
      });
      if (isCheckStatus) {
        if (isCheckStatus.dataValues.status === 3) {
          const isCheck = await db.ListPeopleJoin.findOrCreate({
            where: {
              EventId: body.eventId,
              UserId: userId,
              roomId: body.roomId,
            },
            defaults: {
              isJoined: true,
              roomId: body.roomId,
              UserId: userId,
              EventId: body.eventId,
            },
          });
          if (!isCheck[1]) {
            const response = await db.ListPeopleJoin.update(
              { isJoined: true },
              {
                where: {
                  eventId: body.eventId,
                  userId: userId,
                  roomId: body.roomId,
                },
              }
            );
            resolve({
              success: response[0] > 0 ? true : false,
              mess:
                response[0] > 0
                  ? "Cập nhật thành công"
                  : "Đã có lỗi gì đó xảy ra",
            });
          } else {
            resolve({
              success: isCheck[1] ? true : false,
              mess: isCheck[1]
                ? "Tham gia thành công"
                : "Đã có lỗi gì đó xảy ra",
            });
          }
        } else if (isCheckStatus.dataValues.status === 2) {
          resolve({
            success: false,
            mess: "Sự kiện này chưa diễn ra",
          });
        } else if (isCheckStatus.dataValues.status === 4) {
          resolve({
            success: false,
            mess: "Sự kiện đã kết thúc",
          });
        } else {
          resolve({
            success: false,
            mess: "Sự kiện không tồn tại",
          });
        }
      } else {
        resolve({
          success: false,
          mess: "Sự kiện không tồn tại",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllEventOfAuthor = (
  authorId,
  { title, eventIds, status, limit, page, ...query }
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const queries = { raw: false, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit;
      queries.distinct = true;
      if (limit) {
        queries.offset = offset * fLimit;
        queries.limit = fLimit;
      }
      if (eventIds) {
        let ids = eventIds.split(",").map((item) => Number(item));
        query.id = { [Op.or]: ids };
      }
      if (title) query.title = { [Op.substring]: title };
      if (status) {
        let statusess = status.map((item) => Number(item));
        query.status = { [Op.or]: statusess };
      }
      const response = await db.Event.findAndCountAll({
        where: { authorId: authorId, ...query },
        order: [["createdAt", "DESC"]],
        ...queries,
        include: [
          {
            model: db.User,
            as: "author",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.User,
            as: "followers",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.User,
            as: "userJoined",
            attributes: ["id", "name", "birthDate", "facultyCode"],
            include: [
              {
                model: db.Student,
                as: "studentData",
                attributes: ["studentCode", "classCode"],
              },
              {
                model: db.Faculty,
                as: "facultyData",
                attributes: ["nameFaculty"],
              },
            ],
          },
          {
            model: db.Status,
            as: "statusEvent",
            attributes: ["id", "statusName"],
          },
          {
            model: db.OfflineEvent,
            as: "offlineEvent",
          },
          {
            model: db.OnlineEvent,
            as: "onlineEvent",
          },
        ],
      });

      response.rows.forEach((event) => {
        event.dataValues.onlineEvent.length === 0
          ? (event.dataValues.onlineEvent = null)
          : event.dataValues.onlineEvent;

        event.dataValues.offlineEvent.length === 0
          ? (event.dataValues.offlineEvent = null)
          : event.dataValues.offlineEvent;
      });

      response.rows.forEach((event) => {
        event.dataValues.followers.forEach((follower) => {
          delete follower.dataValues.ListEventFollow;
        });
      });

      // response.rows.forEach((event) => {
      //   event.dataValues.userJoined.forEach((user) => {
      //     const userJoined = user.dataValues.ListPeopleJoin;
      //     user.dataValues.roomId = userJoined.roomId;

      //     delete user.dataValues.ListPeopleJoin;
      //   });
      // });

      response.rows.forEach((event) => {
        event.dataValues.userJoined.forEach((user) => {
          const userJoined = user.dataValues.ListPeopleJoin;
          const student = user.dataValues.studentData;
          const faculty = user.dataValues.facultyData;

          user.dataValues.studentCode = student.studentCode;
          user.dataValues.classCode = student.classCode;
          user.dataValues.nameFaculty = faculty.nameFaculty;
          user.dataValues.isJoined = userJoined.isJoined;

          delete user.dataValues.studentData;
          delete user.dataValues.facultyData;
          delete user.dataValues.ListPeopleJoin;
        });
      });
      resolve({
        success: response ? true : false,
        mess: response ? "Get data success" : "Get data failure",
        response: response.rows,
        count: response.count,
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getEventJoined = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.ListPeopleJoin.findAndCountAll({
        where: { UserId: userId },
        include: [
          {
            model: db.Event,
            as: "eventData",
          },
        ],
      });
      resolve({
        success: response ? true : false,
        mess: response ? "Get data success" : "Get data failure",
        response: response.rows,
        count: response.count,
      });
    } catch (error) {
      reject(error);
    }
  });
};

// export const test = () => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const people = await db.ListPeopleJoin.findAll({
//         where: { [Op.and]: [{ EventId: 205 }, { isJoined: true }] },
//       });
//       const event = await db.Event.findOne({ where: { id: 205 } });
//       people.forEach(async (item) => {
//         const student = await db.Student.findOne({
//           where: { studentId: item.dataValues.userId },
//         });
//         if (student) {
//           student.dataValues.point += event.dataValues.addPoint;
//           await db.Student.update(
//             { point: student.dataValues.point },
//             { where: { studentId: item.dataValues.userId } }
//           );
//         }
//       });
//       resolve({
//         err: people ? true : false,
//         mess: people
//           ? "Cập nhật trạng thái thành công"
//           : "Đã có lỗi gì đó xảy ra",
//         event: event.dataValues.addPoint,
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
// };
