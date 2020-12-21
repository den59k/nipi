const validate = require('../libs/validate')

const properties = {
	login: { type: "string" },
	password: { type: "string" }
}

const postSchema = { properties, required: ["login", "password"] }


module.exports = function(app, db) {

	app.post('/auth', validate(postSchema), async(req, res) => {
		const { login, password } = req.body
	
		if(login !== process.env.LOGIN || password !== process.env.PASSWORD)
			return res.json({error: {password: "Неверный пароль"}})

		res.setHeader("Set-Cookie", `pass=${password};max-age=31536000; path=/`)

		res.json({success: "success"})
	})

	
	app.use((req, res, next) => {
		const { pass } = req.cookies
		
		if(!pass || pass !== process.env.PASSWORD)
			return res.json({error: "wrong token"})

		next()
	})
}