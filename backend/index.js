require('dotenv').config()
const express = require('express')
const chalk = require('chalk')
const { MongoClient } = require('mongodb')
const routeApp = require('./src/routes')
const initDB = require('./src/init-db')
const { base } = require('./src/libs/path')

const dbName = 'nipi'
const app = express()
const port = process.env.PORT || 3101

async function init (){
  const client = await MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true })
  const db = client.db(dbName)
  console.log(chalk.green(`Success connected to db ${dbName}`))
  
  await initDB(db)
  
  const router = express.Router()
  routeApp(router, db)

  app.use('/db', express.static(base('db')))
  app.use('/api', router)

  app.listen(port, () => console.log(chalk.green(`Success app listening at http://localhost:${port}`)))
}

init()
