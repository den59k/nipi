import getDB from 'libs/db'
import { nanoid } from 'nanoid'

export default async (req, res) => {

	if(req.method === 'GET'){
		const db = await getDB()
		
		let token = req.cookies.token

		const options = { projection: {_id: 0} }

		const photos = await db.collection('photos').find({accepted: true}, options).toArray()
		const messages = await db.collection('chat').find({accepted: true}, options).toArray()

		const likes = await db.collection('votes').find({}, {...options, sort: { index: 1 }}).toArray()

		if(!token){
			token = nanoid(30)
			res.setHeader("Set-Cookie", `token=${token};max-age=31536000; path=/;`)
		}

		let indexes
		indexes = await db.collection('likes').find({ip: token}, { projection: { _id: 0, ip: 0 }}).toArray()

		await db.collection('online').updateOne({token}, {$set: { time: Date.now() } }, { upsert: true })

		const timing = await db.collection('options').findOne({key: 'timing'}, { projection: { _id: 0, key: 0 } } )

		res.json({photos, messages, likes, indexes, timing})
	}
}