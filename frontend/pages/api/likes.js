import getDB from 'libs/db'
import validate from 'libs/validate'
import { nanoid } from 'nanoid'

const properties = {
	index: { type: "integer" }
}

const schema = { properties, required: ["index"] }

export default async (req, res) => {

	const db = await getDB('likes')
	const voteDB = await getDB('votes')

	let token = req.cookies.token
	if(!token){
		token = nanoid(30)
		res.setHeader("Set-Cookie", `token=${token};max-age=31536000; path=/;`)
	}
	
	try{
		if(req.method === 'POST'){
			if(!validate(req, res, schema)) return

			await db.insertOne({ip: token, index: req.body.index})
			await voteDB.updateOne({index: req.body.index}, { $inc: { likes: 1 }})
			res.json({count: 1})
		}

		if(req.method === 'DELETE'){
			if(!validate(req, res, schema)) return

			const resp = await db.deleteOne({ip: token, index: req.body.index})
			await voteDB.updateOne({index: req.body.index}, { $inc: { likes: -1 }})

			res.json({count: resp.deletedCount})
		}

	}catch(e){
		res.json({error: 'exist'})
	}
}