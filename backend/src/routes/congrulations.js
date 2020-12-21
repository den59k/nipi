const { ObjectID } = require('mongodb')
const validate = require('../libs/validate')
const { filterBody } = require('../libs/db-extensions')
const { toDotNotation } = require('../libs/db-extensions')

const properties = {
	title: { type: "string" },
	youtube_id: { type: "string" },
	wistia: { type: "string" }
}

const postSchema = { properties, required: [ "title" ] }

const wishProperties = {
	name: { type: "string" },
	role: { type: "string" },
	wish: { type: "string" }
}

const wishesSchema = {
	properties: wishProperties
}

module.exports = function (app, db){
	const collection = db.collection('congrulations')
	app.get('/congrulations', async(_req, res) => {
		const resp = await getCongrulations(collection)
		res.json(resp)
	})

	app.post('/congrulations', validate(postSchema), async(req, res) => {
		const resp = await addCongrulation(collection, filterBody(req.body, properties))
		res.json(resp)
	})

	app.put('/congrulations/:_id', validate(postSchema), async(req, res) => {
		const resp = await updateCongrulation(collection, req.params._id, filterBody(req.body, properties))
		res.json(resp)
	})

	app.delete('/congrulations/:_id', async(req, res) => {
		const resp = await deleteCongrulation(collection, req.params._id)
		res.json(resp)
	})

	//Для пожеланий
	app.post('/congrulations/:_id/wishes', validate(wishesSchema), async(req, res) => {
		const resp = await addWish(collection, req.params._id, filterBody(req.body, wishProperties))
		res.json(resp)
	})

	app.put('/congrulations/:_id/wishes/:index', validate(wishesSchema), async(req, res) => {
		const resp = await updateWish(collection, req.params._id, req.params.index, filterBody(req.body, wishProperties))
		res.json(resp)
	})

	app.delete('/congrulations/:_id/wishes/:index', async(req, res) => {
		const resp = await deleteWish(collection, req.params._id, req.params.index)
		res.json(resp)
	})
}

async function getCongrulations(collection){
	const resp = await collection.find({}, { sort: { time: -1 }}).toArray()

	return resp
}

async function addCongrulation(collection, values){
	const resp = await collection.insertOne(values)
	return { count: resp.insertedCount }
}

async function updateCongrulation (collection, _id, values){
	const resp = await collection.updateOne({_id: new ObjectID(_id)}, {$set: values})
	return { count: resp.modifiedCount }
}

async function deleteCongrulation(collection, _id){
	const resp = await collection.deleteOne({_id: new ObjectID(_id)})
	return { count: resp.deletedCount }
}


async function addWish(collection, _id, values){
	const resp = await collection.updateOne({_id: new ObjectID(_id)}, {$push: {wishes: values}})
	return { count: resp.modifiedCount }
}

async function updateWish(collection, _id, index, values){
	
	const data = toDotNotation(values, 'wishes.'+index+'.')
	const resp = await collection.updateOne({_id: new ObjectID(_id)}, {$set: data})
	return { count: resp.modifiedCount }
}

async function deleteWish(collection, _id, index){
	const preResp = await collection.updateOne({_id: new ObjectID(_id)}, {$set: { ['wishes.'+index]: null }})
	const resp = await collection.updateOne({_id: new ObjectID(_id)}, { $pull: { wishes: null } })
	return { count: resp.modifiedCount }
}