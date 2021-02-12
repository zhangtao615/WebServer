const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const { access } = require('./src/utils/log')

// session 数据
const SESSION_DATE = {}

// 处理postData
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== "POST") {
      resolve({})
      return 
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return 
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      } else {
        resolve(JSON.parse(postData))
      }
    })
  })
  return promise
}

// 设置cookie过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  return d.toGMTString()
}

const serverHandle = (req, res) => {
  // 记录access log
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)
  // 设置返回格式 JSON
  res.setHeader('Content-type', 'application/json')

  //获取path
  const url = req.url
  req.path = url.split('?')[0]

  // 解析 query
  req.query = querystring.parse(url.split('?')[1])

  // 解析cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return 
    }
    const arr = item.split('=')
    const key = arr[0].trim()
    const val = arr[1].trim()
    req.cookie[key] = val
  });

  // 解析session
  let needSetCookie = false
  let userId = req.cookie.userid
  if (userId) {
    // 没有就初始化为空对象再赋值
    if (!SESSION_DATE[userId]) {
      SESSION_DATE[userId] = {}
    }
  } else {
    needSetCookie = true
    userId = Date.now()
    SESSION_DATE[userId] = {}
  }
  // 如果有userId就是直接赋值
  req.session = SESSION_DATE[userId]

  // 处理postData
  getPostData(req).then(postData => {
    req.body = postData
    // 处理blog路由
    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      blogResult.then(blogData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expries=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(blogData))
      })
      return 
    }

    // 处理user路由
    const userResult = handleUserRouter(req, res)
    if (userResult) {
      userResult.then(userData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expries=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(userData))
      })
      return
    }

    // 未命中返回404
    res.writeHead(404, {'Content-type': 'text/plain'})
    res.write('404 Not Found\n')
    res.end()
  })
  
  
}

module.exports = serverHandle

// process.env.NODE_ENV