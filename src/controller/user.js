const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = (username, password) => {
  // 使用escape后拼接sql语句需要加引号
  let username = escape(username)
   
  // 生成加密密码
  let password = genPassword(password)
  password = escape(password)
  const sql = `
    select username, realname from t_users where username=${username} and password=${password};
  `
  return exec(sql).then(rows => {
    return rows[0] || {}
  })
}

module.exports = {
  login
}