const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Bloglist app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByRole('heading', { name: 'Login' })
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      await page.waitForResponse(r => r.status() === 401)
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })


  describe('when logged in', () => {
    beforeEach(async ( {page} ) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ( {page} ) => {
      await createBlog(page, 'Hello', 'Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2018/01/01/hello-w0rld.html')
      await expect(page.getByText('Hello Robert C. Martin')).toBeVisible()
    })

    test('a blog can be liked', async ({ page}) => {
      await createBlog(page, 'Hello', 'Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2018/01/01/hello-w0rld.html')
      await page.getByRole('button', { name: 'view'}).click()
      await expect(page.getByRole('button', { name: 'like'}).locator('..')).toHaveText('0 like')

      await page.getByRole('button', { name: 'like'}).click()
      await expect(page.getByRole('button', { name: 'like'}).locator('..')).toHaveText('1 like')
    })

    test('the user who added the blog can delete the blog', async ({ page }) => {
      await createBlog(page, 'Hello', 'Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2018/01/01/hello-w0rld.html')
      await page.getByRole('button', { name: 'view'}).click()
      await page.getByRole('button', { name: 'remove'}).click()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove'}).click()
      await expect(page.getByText('Hello Robert C. Martin')).not.toBeVisible()
    })

    test('only the user who added the blog sees the blog\'s delete button', async ({ page, request }) => {
      await request.post('/api/users', {
        data: {
          name: 'Richard M.',
          username: 'react',
          password: 'hello-react'
        }
      })
      await createBlog(page, 'Hello', 'Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2018/01/01/hello-w0rld.html')
      await page.getByRole('button', { name: 'view'}).click()
      await expect(page.getByRole('button', { name: 'remove'})).toBeVisible()

      await page.getByRole('button', { name: 'logout'}).click()
      await loginWith(page, 'react', 'hello-react')

      await page.getByRole('button', { name: 'view'}).click()
      await expect(page.getByRole('button', { name: 'remove'})).not.toBeVisible()
    })

    test('the blogs are arranged in the order according to the likes, the blog with the most likes first', async ({ page }) => {
      await createBlog(page, 'Hello', 'Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2018/01/01/hello-w0rld.html')
      await page.getByRole('button', { name: 'view'}).click()
      await page.getByRole('button', { name: 'like'}).click()

      await createBlog(page, 'TDD', 'Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2019/03/02/TDD-is-harmful.html')

      await expect(page.getByText('Robert C. Martin', {exact: false}).first()).toHaveText('Hello Robert C. Martin')

      await page.getByRole('button', { name: 'view'}).last().click()
      await page.getByRole('button', { name: 'like'}).last().click()
      await page.getByRole('button', { name: 'like'}).last().click()
      await page.getByRole('button', { name: 'like'}).last().click()

      await expect(page.getByText('Robert C. Martin', {exact: false}).first()).toHaveText('TDD Robert C. Martin')
    })
  })
})
