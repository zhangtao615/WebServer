const { exec } = require('../db/mysql')

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
  console.log(blogData)
  const title = blogData.title
  const content = blogData.content
  const author = blogData.author
  const createTime = Date.now()

  const sql = `
    insert into t_blogs (title, content, createTime, author)
    values ('${title}', '${content}', ${createTime}, '${author}');
  `
  return exec(sql).then(insertData => {
    console.log(insertData)
    return { id : insertData.insertId }
  })

}
const updateBlog = (id, blogData = {}) => {
  const title = blogData.title
  const content = blogData.content

  const sql = `
    update t_blogs set title='${title}', content='${content}' where id=${id}
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