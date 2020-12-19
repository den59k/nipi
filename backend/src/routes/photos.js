const { ObjectID } = require('mongodb')
const validate = require('../libs/validate')
const { filterBody } = require('../libs/db-extensions')

const properties = {
	accepted: { type: "boolean" },
	rejected: { type: "boolean" }
}

const putSchema = { properties }

module.exports = function (app, db){
	const collection = db.collection('photos')
	app.get('/photos', async(_req, res) => {
		const resp = await getPhotos(collection)
		res.json(resp)
	})

	app.put('/photos/:_id', validate(putSchema), async(req, res) => {
		const resp = await updatePhoto(collection, req.params._id, filterBody(req.body, properties))
		res.json(resp)
	})

	app.delete('/photos/:_id', async(req, res) => {
		const resp = await deletePhoto(collection, req.params._id)
		res.json(resp)
	})
}

async function getPhotos(collection){
	const resp = await collection.find({}, { sort: { time: -1 }}).toArray()

	return resp
}

async function updatePhoto (collection, _id, values){
	const resp = await collection.updateOne({_id: new ObjectID(_id)}, {$set: values})
	return { count: resp.modifiedCount }
}

async function deletePhoto(collection, _id){
	const resp = await collection.deleteOne({_id: new ObjectID(_id)})
	return { count: resp.deletedCount }
}