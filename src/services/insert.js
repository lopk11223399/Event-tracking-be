import db from "../models";
import data from "../data/user.json";
import dataEvent from "../data/events.json";
import comment from "../data/comment.json";
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const hashPassword = (password) => bcrypt.hashSync(password, salt);

export const insertDataUser = () =>
  new Promise(async (resolve, reject) => {
    try {
      const formatDate = (date) => {
        const dateSplit = date.split("/");
        return `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`;
      };
      data.forEach(async (student) => {
        const response = await db.User.create({
          name: student.fullName,
          birthDate: formatDate(student.birthDate),
          username: student.slug,
          email: student.slug + "@dtu.edu.vn",
          password: hashPassword("12345678"),
          gender: student.gender === "Nam" ? false : true,
          facultyCode: [1, 2, 3, 4, 5][Math.floor(Math.random() * 4)],
        });
        await db.Student.create({
          studentId: response.dataValues.id,
          classCode: student.classCode,
          program: student.program,
          studentCode: student.studentCode,
        });
      });
      resolve("ok");
    } catch (e) {
      reject(e);
    }
  });

export const insertDataEvent = () =>
  new Promise(async (resolve, reject) => {
    try {
      dataEvent.forEach(async (event) => {
        const response = await db.Event.create({
          title: event.title,
          startDate: event.startDate,
          finishDate: event.finishDate,
          image: event.image,
          description: event.description,
          typeEvent: event.typeEvent,
          status: event.status,
          linkUrl: event.linkUrl,
          totalRate: event.totalRate,
          addPoint: event.addPoint,
          authorId: [1, 2, 3, 4, 5][Math.floor(Math.random() * 4)],
          location: event.location,
          limitParticipant: event.limitParticipant,
        });
      });
      resolve("ok");
    } catch (e) {
      reject(e);
    }
  });

export const insertFaculty = () =>
  new Promise(async (resolve, reject) => {
    try {
      const data = await db.User.update({
        facultyCode: [1, 2][Math.floor(Math.random() * 4)],
      });
      resolve("ok");
    } catch (e) {
      reject(e);
    }
  });

export const insertComment = () =>
  new Promise(async (resolve, reject) => {
    try {
      comment.forEach(async (comment) => {
        await db.Comment.create({
          EventId: Math.floor(Math.random() * 10) + 1,
          UserId: Math.floor(Math.random() * 10) + 1,
          comment: comment.comment,
        });
      });
      resolve("ok");
    } catch (e) {
      reject(e);
    }
  });
