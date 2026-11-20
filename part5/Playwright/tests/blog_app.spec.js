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

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials').waitFor()
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
  })
})
