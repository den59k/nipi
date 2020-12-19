const validate = require('../libs/validate')

const properties = {
	login: { type: "string" },
	password: { type: "string" }
}

const postSchema = { properties, required: ["login", "password"] }


module.exports = function(app, db) {

	app.post('/auth', validate(postSchema), async(req, res) => {
		res.json({ok: "ok"})
	})

}