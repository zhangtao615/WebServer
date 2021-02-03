const getList = (author, keyword) => {
  return [
    {
      id: 1,
      title: 'A',
      content: '内容B',
      createTime: 1612313160180,
      author: '7years'
    },
    {
      id: 2,
      title: 'B',
      content: '内容B',
      createTime: 1612313193180,
      author: 'zhangsan'
    }
  ]
}
const getDetail = (id) => {
  return {
    id: 1,
    title: 'A',
    content: '内容B',
    createTime: 1612313160180,
    author: '7years'
  }
}
const newBlog = (blogData = {}) => {
  return {
    id: 3, // 博客id
  }
}
const updateBlog = (id, blogData = {}) => {
  console.log(id, blogData)
  return true
}
const delBlog = (id) => {
  return true
}
module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}