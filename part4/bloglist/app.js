const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

const app = express()
app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app