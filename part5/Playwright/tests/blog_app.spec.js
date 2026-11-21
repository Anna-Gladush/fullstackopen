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
    await page.goto('/login')
    const locator = page.getByRole('heading', { name: 'Login' })
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await page.waitForResponse(r => r.status() === 200)
      const successDiv = page.locator('.error')
      await expect(successDiv).toContainText('Successfully logged in as mluukkai')
      await expect(successDiv).toHaveCSS('border-style', 'solid')
      await expect(successDiv).toHaveCSS('color', 'rgb(0, 128, 0)')

    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      await page.waitForResponse(r => r.status() === 401)
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })
  })


  describe('when logged in', () => {
    beforeEach(async ( {page} ) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await page.getByRole('button', { name: 'logout' }).waitFor()
    })

    test('a new blog can be created', async ( {page} ) => {
      await createBlog(page, 'Hello', 'Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2018/01/01/hello-w0rld.html')
      await expect(page.getByRole('link', {name: 'Hello'})).toBeVisible()
    })

    test('a blog can be liked', async ({ page}) => {
      await createBlog(page, 'Hello', 'Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2018/01/01/hello-w0rld.html')
      page.getByRole('link', {name: 'Hello'}).click()
      await page.getByRole('button', { name: 'view'}).click()
      await expect(page.getByRole('button', { name: 'like'}).locator('..')).toHaveText('0 like')

      await page.getByRole('button', { name: 'like'}).click()
      await expect(page.getByRole('button', { name: 'like'}).locator('..')).toHaveText('1 like')
    })

    test('the user who added the blog can delete the blog', async ({ page }) => {
      await createBlog(page, 'Hello', 'Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2018/01/01/hello-w0rld.html')
      page.getByRole('link', {name: 'Hello'}).click()
      await page.getByRole('button', { name: 'view'}).click()
      await page.getByRole('button', { name: 'remove'}).click()
      page.on('dialog', dialog => dialog.accept())
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
      page.getByRole('link', {name: 'Hello'}).click()
      await page.getByRole('button', { name: 'view'}).click()
      await expect(page.getByRole('button', { name: 'remove'})).toBeVisible()

      await page.getByRole('button', { name: 'logout'}).click()
      await page.getByRole('link', { name: 'login' }).waitFor()

      await loginWith(page, 'react', 'hello-react')
      page.getByRole('link', {name: 'Hello'}).click()

      await page.getByRole('button', { name: 'view'}).click()
      await expect(page.getByRole('button', { name: 'remove'})).not.toBeVisible()
    })

    test('the blogs are arranged in the order according to the likes, the blog with the most likes first', async ({ page }) => {
      await createBlog(page, 'Hello', 'Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2018/01/01/hello-w0rld.html')
      page.getByRole('link', {name: 'Hello'}).click()
      await page.getByRole('button', { name: 'view'}).click()
      await page.getByRole('button', { name: 'like'}).click()

      await createBlog(page, 'TDD', 'Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2019/03/02/TDD-is-harmful.html')

      await expect(page.getByRole('listitem').first()).toHaveText('Hello')
      page.getByRole('link', {name: 'TDD'}).click()
      await page.getByRole('button', { name: 'view'}).last().click()
      await page.getByRole('button', { name: 'like'}).last().click()
      await page.getByRole('button', { name: 'like'}).last().click()
      await page.getByRole('button', { name: 'like'}).last().click()

      await page.getByRole('link', {name: 'blogs'}).click()
      await expect(page.getByRole('listitem').first()).toHaveText('TDD')
    })
  })
})
