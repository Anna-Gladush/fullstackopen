const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  let favorite = blogs[0]
  blogs.forEach(blog => {
    if (blog.likes > favorite.likes) {
      favorite = blog
    }
  })
  return favorite
}

const mostBlogs = (blogs) => {
  const authors = []
  blogs.map(blog => {
    const author = authors.find(author => author.author === blog.author)
    if (author !== undefined) {
      author.blogs ++
      return
    }
    authors.push({ author: blog.author, blogs: 1 })
  })
  let result = authors[0]
  authors.forEach(author => {
    if (author.blogs > result.blogs) {
      result = author
    }
  })
  return result
}

const mostLikes = (blogs) => {
  const authors = []
  blogs.map(blog => {
    const author = authors.find(author => author.author === blog.author)
    if (author !== undefined) {
      author.likes += blog.likes
      return
    }
    authors.push({ author: blog.author, likes: blog.likes })
  })
  let result = authors[0]
  authors.forEach(author => {
    if (author.likes > result.likes) {
      result = author
    }
  })
  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

