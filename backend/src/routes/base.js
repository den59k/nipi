module.exports = function(app, db) {
    app.get('/', (req, res) => {

        res.json({str: 'Hello world'})
    })
}