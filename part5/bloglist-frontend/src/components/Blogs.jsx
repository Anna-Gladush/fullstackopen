import Blog from './Blog'
import { Link } from 'react-router-dom'
const Blogs = ({ blogs }) => {

  return (
    <div>
      <h2>blogs</h2>
      <ul>
        {blogs ? blogs.map(blog =>
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ) : null}
      </ul>

    </div>
  )
}

export default Blogs