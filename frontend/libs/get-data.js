import getDB from 'libs/db'

export default async function getData(){

	const db = await getDB('congrulations')
	
	const congrulations = await db.find({}, { projection: { _id: 0 }}).toArray()

	return { congrulations }
}