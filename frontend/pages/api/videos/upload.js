import { nanoid } from 'nanoid'
import getDB from 'libs/db'
import fs from 'fs'
import getRawBody from 'raw-body'
import { getExtension } from 'mime'
import ffmpeg from 'fluent-ffmpeg'

const path = '/db/videos/'
const publicPath = process.cwd()+"/public";
fs.mkdirSync(publicPath+path, {recursive: true});

const createPreview = (pathVideo, pathPreview) => new Promise((res, rej) => {
	ffmpeg(pathVideo)
	.outputOptions('-qscale 5')
	.size('?x256')
	.frames(1)
	.save(pathPreview)
	.on('end', function(){
		res();
	})
	.on('error', function(err, stdout, stderr) {
    rej(err);
  });
})

const delay = (seconds) => new Promise((res, rej) => {
	setTimeout(res, seconds)
})

export default async (req, res) => {

	if(req.method === 'POST'){
		const type = req.headers['content-type']

		try{
			const db = await getDB('videos')

			const buffer = await getRawBody(req, { length: req.headers['content-length'], limit: '50mb'});


			const nameVideo = path+nanoid(20)
			const src = nameVideo+"."+getExtension(type)
			const preview = nameVideo+"-preview.jpg"
			
			await fs.promises.writeFile(publicPath+src, buffer)
			await createPreview(publicPath+src, publicPath+preview)
			
			await db.insertOne({ src, preview, time: Date.now(), accepted: true })
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