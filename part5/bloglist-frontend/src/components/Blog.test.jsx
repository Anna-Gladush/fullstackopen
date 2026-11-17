import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author of the blog, but doesn\'t render URL or likes by default', () => {
  const user = 'mchan'
  const blog = {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    user,
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  }

  render(<Blog blog={blog} handleRemove={() => console.log('removed')} updateLikes={() => console.log('updated')} user={user} />)

  const title = screen.getByText('React patterns', { exact: false })
  const author = screen.getByText('Michael Chan', { exact: false })
  const url = screen.getByText('https://reactpatterns.com/', { exact: false })
  const likes = screen.getByText('7', { exact: false })
  expect(title).toBeDefined()
  expect(author).toBeDefined()
  expect(url).toBeNull()
  expect(likes).toBeNull()
})