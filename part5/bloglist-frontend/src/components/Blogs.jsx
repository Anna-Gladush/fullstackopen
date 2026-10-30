import Blog from './Blog'

const Blogs = ({ blogs, updateLikes, handleRemove, user }) => {

  return (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleRemove={handleRemove} updateLikes={updateLikes} user={user} />
      )}
    </div>
  )
}

export default Blogs