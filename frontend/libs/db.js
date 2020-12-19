import { MongoClient } from 'mongodb'

async function initialize(){

	const mongoClient = new MongoClient("mongodb://localhost:27017/"	, { useUnifiedTopology: true });

	const client = await mongoClient.connect();

	const db = client.db(process.env.DB_NAME)

	const dbNames = await db.listCollections({}).map(e => e.name).toArray();

	if(!dbNames.includes('likes')){
		const collection = await db.createCollection('likes')
		collection.createIndex({'ip': 1, 'index': 1}, { unique: true })
	}

	if(!dbNames.includes('votes')){
		const collection = await db.createCollection('votes')
		for(let i = 0; i < 13; i++)
			collection.insertOne({index: i, likes: 0})
	}

	return db
}

let db
export default async function getDB(collection){
	if(!db)
		db = await initialize()

	if(collection)
		return db.collection(collection);
	else
		return db;
}
