import getDB from 'libs/db'
import validate from 'libs/validate'

const properties = {
	name: { type: "string", minLength: 1, maxLength: 100 },
	surname: { type: "string", maxLength: 100  },
	unit: { type: "string" },
	text: { type: "string", minLength: 4 },
	avatar: { type: "string" }
}

const schema = { properties, required: ["name", "text"] }

export default async (req, res) => {
	const db = await getDB('chat')

	if(req.method === 'GET'){
		const response = await db.find({accepted: true}).toArray()
		res.json(response)
	}

	if(req.method === 'POST'){
	
		if(!validate(req, res, schema)) return
		
		const obj = {...req.body, time: Date.now() }

		const response = await db.insertOne(obj)

		res.json({count: response.insertedCount})
	}
}