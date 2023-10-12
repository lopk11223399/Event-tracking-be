import db from '../models'
import data from '../data/user.json'
import dataEvent from '../data/event.json'
var bcrypt = require('bcryptjs')
var salt = bcrypt.genSaltSync(10)

const hashPassword = password => bcrypt.hashSync(password, salt)

export const insertDataUser = () =>
	new Promise(async (resolve, reject) => {
		try {
			const formatDate = date => {
				const dateSplit = date.split('/')
				return `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`
			}
			data.forEach(async student => {
				const response = await db.User.create({
					name: student.fullName,
					birthDate: formatDate(student.birthDate),
					username: student.slug,
					email: student.slug + '@dtu.edu.vn',
					password: hashPassword('123456789'),
					gender: student.gender === 'Nam' ? false : true,
					roleId:
						data.studentCode === '26211141778'
							? 1
							: data.studentCode === '26211126344' ||
							  data.studentCode === '26201141758'
							? 2
							: 3,
				})
				await db.Student.create({
					studentId: response.dataValues.id,
					classCode: student.classCode,
					program: student.program,
					studentCode: student.studentCode,
				})
			})
			resolve('ok')
		} catch (e) {
			reject(e)
		}
	})

export const insertDataEvent = () =>
	new Promise(async (resolve, reject) => {
		try {
			dataEvent.forEach(async event => {
				const response = await db.Event.create({
					title: event.title,
					startDate: event.startDate,
					finishDate: event.finishDate,
					image: event.image,
					description: event.description,
					typeEvent: Math.random() > 0.5 ? 1 : 0,
					status: 4,
					authorId: [2, 3][Math.floor(Math.random() * 2)],
					location:
						'30, Đường Nguyễn Hữu Thọ, Phường Hòa Thuận Tây, Quận Hải Châu, Đà Nẵng, Việt Nam',
					limitParticipant: 50,
				})
			})
			resolve('ok')
		} catch (e) {
			reject(e)
		}
	})
