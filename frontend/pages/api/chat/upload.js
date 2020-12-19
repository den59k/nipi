import { nanoid } from 'nanoid'
import getDB from 'libs/db'
import fs from 'fs'
import getRawBody from 'raw-body'
import sharp from 'sharp'

const path = '/db/temp/'
const publicPath = process.cwd()+"/public";
fs.mkdirSync(publicPath+path, {recursive: true});

export default async (req, res) => {

	if(req.method === 'POST'){
	
		try{
			const db = await getDB('photos')

			const buffer = await getRawBody(req, { length: req.headers['content-length'], limit: '5mb'});

			const preview = path+nanoid(20) + ".jpg"
			await sharp(buffer).rotate().resize({width: 80, height: 80, fit: 'cover'}).jpeg({quality: 75}).toFile(publicPath+preview)

			res.json({src: preview})
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