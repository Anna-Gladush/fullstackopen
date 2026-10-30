const Blog = require('../models/blog')
const userExtractor = require('../utils/middleware').userExtractor
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

blogsRouter.post('/', userExtractor, async (req, res) => {
  const body = req.body

  const user = req.user

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

blogsRouter.delete('/:id', userExtractor, async (req, res) => {

  const user = req.user
  const blog =  await Blog.findById(req.params.id)

  if (user.id.toString() === blog.user.toString()) {
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } else {
    res.status(401).json({ error: 'Unauthorized. You cannot delete someone else\'s blog' })
  }
})

blogsRouter.put('/:id', userExtractor, async (req, res) => {
  const { title, author, url, likes } = req.body

  const user = req.user
  const blogID =  await Blog.findById(req.params.id)

  const blog = {
    title,
    author,
    url,
    likes: likes
  }

  if (user.id.toString() === blogID.user.toString() || (blogID.title === blog.title && blogID.author === blog.author && blogID.url === blog.url)) {
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