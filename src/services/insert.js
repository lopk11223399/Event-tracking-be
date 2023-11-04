import db from "../models";
import data from "../data/user.json";
import dataEvent from "../data/event.json";
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
          typeEvent: Math.random() > 0.5 ? 1 : 0,
          status: 1,
          authorId: [1, 2, 3, 4, 5][Math.floor(Math.random() * 4)],
          location:
            "30, Đường Nguyễn Hữu Thọ, Phường Hòa Thuận Tây, Quận Hải Châu, Đà Nẵng, Việt Nam",
          limitParticipant: 50,
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
