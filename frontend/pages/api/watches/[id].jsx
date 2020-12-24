import getDB from 'libs/db'
import { nanoid } from 'nanoid'

export default async (req, res) => {

	if(req.method === 'POST'){

		const db = await getDB()
		const id = req.query.id;
		let token = req.cookies.token
		
		if(!token || id.length < 3) return res.json({error: "error"})

		try{
			await db.collection('watches').insertOne({ip: token, id})
			res.json({success: "success"})
		}catch(e){
			res.json({error: "exist"})
		}
	}
}