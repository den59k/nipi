const chalk = require('chalk')

//Мы изменяем только вот эту вот схему
const indexes = {
	users: { 
		login: { unique: true },
		token: { unique: true }
	},
	online: {
		token: { unique: true }
	},
	likes: {
		ip: {}
	},
	watches: {}
}

module.exports = async function(db){
	const dbNames = await db.listCollections({}).map(e => e.name).toArray()

	for(let collectionName in indexes){
		if(!dbNames.includes(collectionName)){
			const collection = await db.createCollection(collectionName)
			
			for(let key in indexes[collectionName]){
				const { sort, ...index } = indexes[collectionName][key]	
				await collection.createIndex({[key]: sort || 1}, index)
			}

			if(collectionName === 'likes')
				collection.createIndex({ip: 1, index: 1}, { unique: true })

			if(collectionName === 'watches')
				collection.createIndex({ip: 1, id: 1}, { unique: true })
			
			console.log(`Collection ${chalk.cyan(collectionName)} created`)
		}
	}

	
}