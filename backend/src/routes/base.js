const offset = 60 * 1000

module.exports = function(app, db) {
    app.get('/', async (req, res) => {
        const online = await db.collection('online').find({ time: { $gt: Date.now() - offset } }, {projection: {_id: 1}}).count()
        
        res.json({online})
    })
}