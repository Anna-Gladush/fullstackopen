import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog>', () => {

  test('renders title and author of the blog, but doesn\'t render URL or likes by default', () => {
    const blog = {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      user: 'mchan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    }

    render(<Blog blog={blog} handleRemove={() => console.log('removed')} updateLikes={() => console.log('removed')} user={'mchan'} />)

    const title = screen.getByText('React patterns', { exact: false })
    const author = screen.getByText('Michael Chan', { exact: false })
    const url = screen.queryByText('https://reactpatterns.com/', { exact: false })
    const likes = screen.queryByText('7', { exact: false })

    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(url).toBeNull()
    expect(likes).toBeNull()
  })

  test('blog\'s URL and number of likes are shown when the button controlling the shown details has been clicked', async () => {
    const blog = {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      user: 'mchan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    }

    render(<Blog blog={blog} handleRemove={() => console.log('removed')} updateLikes={() => console.log('removed')} user={'mchan'} />)

    const user = userEvent.setup()
    const btn = screen.getByText('view')
    await user.click(btn)

    const url = screen.queryByText('https://reactpatterns.com/', { exact: false })
    const likes = screen.queryByText('7', { exact: false })
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
  })

  test('toggled content can be closed', async () => {
    const blog = {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      user: 'mchan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    }

    render(<Blog blog={blog} handleRemove={() => console.log('removed')} updateLikes={() => console.log('removed')} user={'mchan'} />)

    const user = userEvent.setup()
    const btn = screen.getByText('view')
    await user.click(btn)

    const hideButton = screen.getByText('hide')
    await user.click(hideButton)

    const url = screen.queryByText('https://reactpatterns.com/', { exact: false })
    const likes = screen.queryByText('7', { exact: false })
    expect(url).toBeNull()
    expect(likes).toBeNull()
  })

  test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
    const blog = {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      user: 'mchan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    }

    const mockLikeFunction = vi.fn()
    render(<Blog blog={blog} handleRemove={() => console.log('removed')} updateLikes={mockLikeFunction} user={'mchan'} />)

    const user = userEvent.setup()
    // screen.debug()
    const showButton = screen.getByText('view', { exact: false })
    await user.click(showButton)

    const btn = screen.getByText('like')
    await user.click(btn)
    await user.click(btn)

    expect(mockLikeFunction.mock.calls).toHaveLength(2)
  })
})