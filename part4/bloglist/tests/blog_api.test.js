const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'root',
      name: 'root',
      passwordHash
    })

    await user.save()

    const users = await helper.usersInDB()
    const root = users.find(user => user.username === 'root')

    await Blog.deleteMany({})
    helper.initialBlogs.forEach(async (blog) => {
      const blogObject = new Blog(blog)
      blogObject.user = root.id
      await blogObject.save()
    })
  })

  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const keys = Object.keys(response.body[0])
    assert(keys.includes('id'))
    assert(!keys.includes('_id'))
  })

  test('a specific blog is within returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(e => e.title)
    assert(titles.includes('Go To Statement Considered Harmful'))
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDB()
      const blogToView = blogsAtStart[0]
      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      blogToView.user = blogToView.user.toJSON()
      assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonExistingID = await helper.nonExistingID()
      await api
        .get(`/api/blogs/${validNonExistingID}`)
        .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new blog', () => {
    test('adding blog fails with status code 401, if token is not provided', async () => {
      const newBlog = {
        title: 'React patterns',
        author: 'Michael',
        url: 'https://reactpatterns.com/',
        likes: 7,
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    })

    test('succeeds with valid data', async () => {
      const token = await api
        .post('/api/login')
        .send({
          username: 'root',
          password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const newBlog = {
        title: 'React patterns',
        author: token.body.name,
        url: 'https://reactpatterns.com/',
        likes: 7,
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDB()
      const titles = blogsAtEnd.map(blogs => blogs.title)

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
      assert(titles.includes('React patterns'))
    })

    test('if likes missing, defaults to 0', async () => {
      const token = await api
        .post('/api/login')
        .send({
          username: 'root',
          password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)


      const newBlog = {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDB()
      const createdBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
      assert.strictEqual(createdBlog.likes, 0)
    })

    test('fails with status code 400 if title invalid', async () => {
      const token = await api
        .post('/api/login')
        .send({
          username: 'root',
          password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const newBlog = {
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token.body.token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDB()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 400 if url invalid', async () => {
      const token = await api
        .post('/api/login')
        .send({
          username: 'root',
          password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const newBlog = {
        author: 'Michael Chan',
        title: 'React patterns',
        likes: 7,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token.body.token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDB()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDB()
      const blogToDelete = blogsAtStart.find(blog => blog.title === 'DD harms architecture')

      const token = await api
        .post('/api/login')
        .send({
          username: 'root',
          password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token.body.token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDB()
      const ids = blogsAtEnd.map(blog => blog.id)

      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('fails with a status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'
      const token = await api
        .post('/api/login')
        .send({
          username: 'root',
          password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${token.body.token}`)
        .expect(400)
    })
  })

  describe('updating blog', () => {
    test('succeeds with status code 200 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDB()
      const blogToUpdate = blogsAtStart[0]
      const token = await api
        .post('/api/login')
        .send({
          username: 'root',
          password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token.body.token}`)
        .send({
          title: blogToUpdate.title,
          author: blogToUpdate.author,
          url: blogToUpdate.url,
          likes: 11
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDB()

      assert.strictEqual(response.body.likes, 11)
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with a status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'
      const token = await api
        .post('/api/login')
        .send({
          username: 'root',
          password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      await api
        .put(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${token.body.token}`)
        .send({
          title: 'title',
          author: 'author',
          url: 'https://example.com',
          likes: 11
        })
        .expect(400)
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
