const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

const blogsRouter = require('express').Router()

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

blogsRouter.post('/', async (req, res) => {
  const body = req.body

  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    return res.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const blog =  await Blog.findById(req.params.id)

  if (user.id.toString() === blog.user.toString()) {
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } else {
    res.status(401).json({ error: 'Unauthorized. You cannot delete someone else\'s blog' })
  }
})

blogsRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const blogID =  await Blog.findById(req.params.id)

  const blog = {
    title,
    author,
    url,
    likes: likes || 0
  }

  if (user.id.toString() === blogID.user.toString()) {
    const newBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
      returnDocument: 'after',
      runValidators: true
    })

    res.status(200).json(newBlog)
  } else {
    res.status(401).json({ error: 'Unauthorized. You cannot edit someone else\'s blog' })
  }

})

module.exports = blogsRouter