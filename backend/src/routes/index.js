const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const userRoute = require('./auth')

//Импортируем все файлы с роутами
const authRoutes = require('./auth')
const baseRoutes = require('./base')
const chatRoutes = require('./chat')
const photoRoutes = require('./photos')
const videoRoutes = require('./videos')
const congrulationsRoutes = require('./congrulations')
const timingRoutes = require('./timing')
const watchesRoutes = require('./watches')

module.exports = function (app, db) {

	app.use(bodyParser.json())
	app.use(bodyParser.raw({ limit: '5mb', type: 'image/*' }))
	app.use(cookieParser())
	
	authRoutes(app, db)
	baseRoutes(app, db)
	chatRoutes(app, db)
	photoRoutes(app, db)
	videoRoutes(app, db)
	congrulationsRoutes(app, db)
	timingRoutes(app, db)
	watchesRoutes(app, db)

	app.use(function(err, _req, res, _next) {
		console.log("ERROR")
		res.json({error: "error"})
	})
	// Тут, позже, будут и другие обработчики маршрутов 
}