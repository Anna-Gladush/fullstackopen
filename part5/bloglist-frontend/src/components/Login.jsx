const Login = ({ username, password, setUsername, setPassword, handleLogin }) => {

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>username:
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
        </div>
        <div>
          <label>password:
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </>

  )
}

export default Login