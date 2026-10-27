# Bloglist

## ! Important !

You should set in <code>.env</code>:
- MONGODB_URI, 
- TEST_MONGODB_URI, 
- SECRET 



<!-- Link: <a href="">app</a> -->
## Project structure

```
├── controllers
│   ├── blogs.js
│   └── users.js
├── models
│   ├── blog.js
│   └── user.js
├── requests
│   ├── get_blogs.rest
│   ├── get_users.rest
│   ├── post_blogs.rest
│   ├── post_users.rest
│   └── put_blogs.rest
├── tests
│   ├── blog_api.test.js
│   ├── list_helper.test.js
│   ├── test_helper.js
│   └── user_api.test.js
├── utils
│   ├── config.js
│   ├── list_helper.js
│   ├── logger.js
│   └── middleware.js  
├── app.js
├── index.js
├── package-lock.json
└── package.json
```