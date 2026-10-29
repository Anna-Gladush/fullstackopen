import { useState, useEffect } from 'react'
import Blogs from './components/Blogs'
import blogService from './services/blogs'
import Login from './components/Login'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)

      setUsername('')
      setPassword('')
    } catch {
      setError('Wrong credentials')
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    window.location.reload();
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
      {error && <p className='error-message'>{error}</p>}
      {!user && <Login username={username} password={password} setUsername={setUsername} setPassword={setPassword} handleLogin={handleLogin} />}
      {user && <>
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
        <Blogs blogs={blogs} />
      </>}
    </div>
  )
}

export default App