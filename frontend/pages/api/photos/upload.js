import { nanoid } from 'nanoid'
import getDB from 'libs/db'
import fs from 'fs'
import getRawBody from 'raw-body'
import sharp from 'sharp'

const path = '/db/photos/'
const publicPath = process.cwd()+"/public";
fs.mkdirSync(publicPath+path, {recursive: true});

export default async (req, res) => {

	if(req.method === 'POST'){
	
		try{
			const db = await getDB('photos')

			const buffer = await getRawBody(req, { length: req.headers['content-length'], limit: '5mb'});
			
			const name = path+nanoid(20)
			const src = name + ".jpg"
			const preview = name + "-preview.jpg"

			await sharp(buffer).resize({width: 600, height: 600, fit: 'cover'}).jpeg({quality: 75}).toFile(publicPath+src)
			//await fs.promises.writeFile(publicPath+src, buffer)

			await sharp(buffer).resize({width: 150, height: 150, fit: 'cover'}).jpeg({quality: 75}).toFile(publicPath+preview)

			await db.insertOne({ src, preview, time: Date.now() })

			res.json({src, preview})
		}catch(e){
			console.log(e)
			res.json({error: "Файл слишком большой"})
		}
	}
}

export const config = {
  api: {
    bodyParser: false
  },
}