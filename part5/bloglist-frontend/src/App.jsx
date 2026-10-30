import { useState, useEffect, useRef } from 'react'
import Blogs from './components/Blogs'
import blogService from './services/blogs'
import Login from './components/Login'
import loginService from './services/login'
import CreateBlog from './components/CreateBlog'
import Notification from './components/Notification'
import Toggable from './components/Toggable'

const dummyMessage = {
  type: null,
  description: null
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(dummyMessage)

  const blogFormRef = useRef()

  const messageFunction = (type, mes) => {
    setMessage({ type, description: mes })
    setTimeout(() => {
      setMessage(dummyMessage)
    }, 5000)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      messageFunction('success', `Successfully logged in as ${username}`)
      setUsername('')
      setPassword('')
    } catch {
      messageFunction('error', 'Wrong credentials')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    const name = user.username
    setUser(null)
    blogService.setToken(null)
    window.location.reload()
    setMessage({ type: 'success', description: `${name} successfully logged out` })
  }

  const addBlog = blogObject => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        const id = returnedBlog.user
        returnedBlog.user = {
          id,
          username: user.username,
          name: user.name
        }
        setBlogs(blogs.concat(returnedBlog))
        messageFunction('success', `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      })
      .catch(err => messageFunction('error', err.response.data.error))
  }

  const updateLikes = async (id) => {
    const blogToUpdate = await blogService.getOne(id)
    blogToUpdate.likes = blogToUpdate.likes + 1

    blogService
      .update(id, blogToUpdate)
      .catch(err => messageFunction('error', err.response.data.error))

    const blogsNew = blogs.map(blog => {
      blog.likes = blog.id === id ? blog.likes + 1 : blog.likes
      return blog
    })
    setBlogs(blogsNew.sort((a, b) => b.likes - a.likes))
  }

  const handleRemove = async (id) => {
    const blogToDelete = blogs.filter(blog => blog.id === id)
    console.log(blogToDelete)
    if (window.confirm(`Remove blog: ${blogToDelete[0].title}?`)) {
      await blogService
        .remove(id)
        .then(() => {
          const updatedBlogs = blogs.filter(blog => blog.id !== id)
          setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
        }
        )
        .catch(err => messageFunction('error', err.response.data.error))
    }
  }

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedBlogUser')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  return (
    <div>
      <h1>Bloglist</h1>
      {message.type && <Notification message={message} />}
      {!user && <Login username={username} password={password} setUsername={setUsername} setPassword={setPassword} handleLogin={handleLogin} />}
      {user && (<>
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
        <Toggable buttonLabel="create new blog" ref={blogFormRef}>
          <CreateBlog createBlog={addBlog} />
        </Toggable>
        <Blogs blogs={blogs} updateLikes={updateLikes} handleRemove={handleRemove} user={user.name} />
      </>)}
    </div>
  )
}

export default App