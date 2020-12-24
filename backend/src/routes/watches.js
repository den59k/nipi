module.exports = function (app, db){
	const collection = db.collection('watches')
	
	app.get('/watches', async(_req, res) => {
		const resp = await getWatches(collection)
		res.json(resp)
	})

}
	
async function getWatches(db){
	const resp = await db.aggregate([{ "$group": { _id: "$id", count: { $sum: 1 } } }, { $sort: { _id: 1 }}]).toArray()

	return resp
}