import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlog from './CreateBlog'

describe('<CreateBlog>', () => {
  test('check, that the form calls the event handler it received as props with the right details when a new blog is created', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<CreateBlog createBlog={createBlog} />)

    const title = screen.getByLabelText('title')
    const author = screen.getByLabelText('author')
    const url = screen.getByLabelText('url')
    const btn = screen.getByText('create')

    await user.type(title, 'Title: testing a form...')
    await user.type(author, 'Author')
    await user.type(url, 'https://www.form-example.com')

    await user.click(btn)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Title: testing a form...')
    expect(createBlog.mock.calls[0][0].author).toBe('Author')
    expect(createBlog.mock.calls[0][0].url).toBe('https://www.form-example.com')
  })
})