const config = require('./utils/config')
const logger = require('./utils/logger')
const app = require('./app')

// const express = require('express')
// // const mongoose = require('mongoose')

// const app = express()

// const blogSchema = mongoose.Schema({
//   title: String,
//   author: String,
//   url: String,
//   likes: Number
// })

// const Blog = mongoose.model('Blog', blogSchema)

// app.use(express.json())

// app.get('/api/blogs', (req, res) => {
//   Blog.find({})
//     .them(blogs => {
//       res.json(blogs)
//     })
// })

// app.post('/api/blogs', (req, res) => {
//   const blog = new Blog(req.body)

//   blog.save().then(result => {
//     res.status(201).jsoт(result)
//   })
// })

// const PORT = 3003

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})