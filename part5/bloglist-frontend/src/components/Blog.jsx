import { useState } from 'react'

const Blog = ({ blog, handleRemove, updateLikes, user }) => {
  const [view, setView] = useState(false)

  return (
    <div style={{
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5
    }}>
      <p>{blog.title} {blog.author}</p>
      <button onClick={() => setView(prev => !prev)}>{view ? 'hide' : 'view'}</button>
      {view && <>
        <p>{blog.url}</p>
        <p>{blog.likes} <button onClick={() => updateLikes(blog.id)}>like</button></p>
        <p>{blog.user.name}</p>
        {user === blog.user.name && <button onClick={() => handleRemove(blog.id)}>remove</button>}
      </>}

    </div>
  )
}

export default Blog