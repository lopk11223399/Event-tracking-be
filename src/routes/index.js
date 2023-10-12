import auth from './authRoutes'
import user from './userRoutes'
import post from './postRoutes'
import comment from './commentRoutes'
import notification from './notificationRoutes'
import follow from './followRoutes'
import insert from './insert'
import joinEvent from './joinEventRoutes'
import faculty from './facultyRoutes'
import { notFound } from '../middlewares/handle_errors'

const initRoutes = app => {
	app.use('/api/v1/insert', insert)
	app.use('/api/v1/auth', auth)
	app.use('/api/v1/user', user)
	app.use('/api/v1/post', post)
	app.use('/api/v1/notification', notification)
	app.use('/api/v1/joinEvent', joinEvent)
	app.use('/api/v1/follow', follow)
	app.use('/api/v1/comment', comment)
	app.use('/api/v1/faculty', faculty)

	app.use(notFound)
}

export default initRoutes
