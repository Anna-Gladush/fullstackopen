import { useState, useEffect } from 'react'
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
  // const [newBlog, setNewBlog] = useState(dummy)

  const messageFunction = (type, mes) => {
    setMessage({ type, description: mes })
    setTimeout(() => {
      setMessage(dummyMessage)
    }, 5000)
  }

  const handleLogin = async (e) => {
    e.preventDefault();
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
    window.location.reload();
    setMessage({ type: 'success', description: `${name} successfully logged out` })
  }

  const addBlog = blogObject => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        messageFunction('success', `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      })
      .catch(err => messageFunction('error', err.response.data.error))
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
        <Toggable buttonLabel="create new blog">
          <CreateBlog createBlog={addBlog} />
        </Toggable>
        <Blogs blogs={blogs} />
      </>)}
    </div>
  )
}

export default App