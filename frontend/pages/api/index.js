import getDB from 'libs/db'

export default async (req, res) => {

	if(req.method === 'GET'){
		const db = await getDB()
		
		const token = req.cookies.token

		const options = { projection: {_id: 0} }

		const photos = await db.collection('photos').find({accepted: true}, options).toArray()
		const messages = await db.collection('chat').find({accepted: true}, options).toArray()

		const likes = await db.collection('votes').find({}, {...options, sort: { index: 1 }}).toArray()

		let indexes
		if(token)
			indexes = await db.collection('likes').find({ip: token}, { projection: { _id: 0, ip: 0 }}).toArray()
		else
			indexes = []

		res.json({photos, messages, likes, indexes})
	}
}