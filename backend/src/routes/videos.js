const { ObjectID } = require('mongodb')
const validate = require('../libs/validate')
const { filterBody } = require('../libs/db-extensions')
const { base } = require('../libs/path')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')

const properties = {
	accepted: { type: "boolean" },
	rejected: { type: "boolean" }
}

const putSchema = { properties }

module.exports = function (app, db){
	const collection = db.collection('videos')
	app.get('/videos', async(_req, res) => {
		const resp = await getVideos(collection)
		res.json(resp)
	})

	app.put('/videos/:_id', validate(putSchema), async(req, res) => {
		const resp = await updateVideo(collection, req.params._id, filterBody(req.body, properties))
		res.json(resp)
	})

	app.delete('/videos/:_id', async(req, res) => {
		const resp = await deleteVideo(collection, req.params._id)
		res.json(resp)
	})

	app.post('/videos/:_id/transcode', async(req, res) => {
		const resp = await transcodeVideo(collection, req.params._id)
		res.json(resp)
	})
}

async function getVideos(collection){
	const resp = await collection.find({}, { sort: { time: -1 }}).toArray()

	return resp
}

async function updateVideo (collection, _id, values){
	const resp = await collection.updateOne({_id: new ObjectID(_id)}, {$set: values})
	return { count: resp.modifiedCount }
}

async function deleteVideo(collection, _id){
	const resp = await collection.deleteOne({_id: new ObjectID(_id)})
	return { count: resp.deletedCount }
}

async function transcodeVideo (collection, _id){
	const video = await collection.findOne({_id: new ObjectID(_id)})

	const transcoded = '/db/videos/'+path.parse(video.src).name+'-converted.mp4'

	ffmpeg(base(video.src))
	.outputOptions('-qscale 16')
	.save(base(transcoded))
	.on('end', function(){
		collection.updateOne({_id: new ObjectID(_id)}, { $set: { transcoding: false, transcoded }, $unset: { seconds: "" } })
	})
	await collection.updateOne({_id: new ObjectID(_id)}, {$set: { transcoding: true, seconds: 0 }})
	return {count: 1}
}