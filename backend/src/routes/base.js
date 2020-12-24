const fs = require('fs')
const offset = 60 * 1000


function _ (k){
	if(k < 10) return '0'+k
	return k
}

module.exports = function(app, db) {
    app.get('/', async (req, res) => {
        const online = await db.collection('online').find({ time: { $gt: Date.now() - offset } }, {projection: {_id: 1}}).count()
        
        res.json({online})
    })

    
	setInterval(async () => {
		const online = await db.collection('online').find({ time: { $gt: Date.now() - offset } }, {projection: {_id: 1}}).count()
		const date = new Date()
		if(online > 0){
            await fs.promises.appendFile(process.cwd+'/../online.log', date.getHours() + ":" + _(date.getMinutes() + "; User online: "+online + "\n"))
        }
	
	}, 60000)
}