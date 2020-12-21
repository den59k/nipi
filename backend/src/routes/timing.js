const { ObjectID } = require('mongodb')
const validate = require('../libs/validate')
const { filterBody } = require('../libs/db-extensions')

module.exports = function (app, db){
	const collection = db.collection('options')

	app.get('/timing', async (req, res) => {
		const timing = await collection.findOne({key: 'timing'}, { projection: {_id: 0, key: 0} })

		res.json(timing)
	})

	app.post('/timing', async (req, res) => {
		const resp = await collection.updateOne({key: 'timing'}, {$set: req.body}, { upsert: true })

		res.json({ count: resp.modifiedCount })
	})
}
