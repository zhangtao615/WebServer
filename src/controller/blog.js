const { exec, escape } = require('../db/mysql')
const xss = require('xss') // 引入xss

const getList = (author, keyword) => {
  let sql = `select * from t_blogs where 1=1 `
  if (author) {
    sql += `and author='${author}' `
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createTime desc;`
  return exec(sql)
}
const getDetail = (id) => {
  let sql = `select * from t_blogs where id='${id}'`
  return exec(sql).then(rows => {
    return rows[0]
  })
  
}
const newBlog = (blogData = {}) => {
  const title = xss(escape(blogData.title))
  const content = xss(escape(blogData.content))
  const author = xss(escape(blogData.author))
  const createTime = Date.now()

  const sql = `
    insert into t_blogs (title, content, createTime, author)
    values (${title}, ${content}, ${createTime}, ${author});
  `
  return exec(sql).then(insertData => {
    console.log(insertData)
    return { id : insertData.insertId }
  })

}
const updateBlog = (id, blogData = {}) => {
  const title = escape(blogData.title)
  const content = escape(blogData.content)

  const sql = `
    update t_blogs set title=${title}, content=${content} where id=${id}
  `
  return exec(sql).then(updateData => {
    if (updateData.affectedRows > 0) {
      return true
    } 
    return false
  })
}
const delBlog = (id, author) => {
  const sql = `delete from t_blogs where id='${id}' and author='${author}'`
  return exec(sql).then(deleteData => {
    if (deleteData.affectedRows > 0) {
      return true
    } 
    return false
  })
}
module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}