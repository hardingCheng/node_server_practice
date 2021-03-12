const { exec } = require('../db/mysql')
const getList = async(author,keyword) => {
   let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like  '%${keyword}%' `
    }
    sql += `order by createtime desc;`
    return await exec(sql)
}
const getDetail = async(id) => {
    const sql = `select * from blogs where id='${id}'`
    const rows = await exec(sql)
    return rows[0]
}
const addBlogContent = async(blogContent = {}) => {
    const { title,content,author } = blogContent
    const createtime = Date.now()
    const sql =  `insert into blogs (title,content,createtime,author) values ('${title}','${content}',${createtime},'${author}');`
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}
const updateBlogContent = async(id,blogContent = {}) => {
    const { title,content } = blogContent
    const sql = `update blogs set title='${title}',content='${content}' where id=${id};`
    const data =  await exec(sql)
    if(data.affectedRows >0) {
        return true
    } else {
        return false
    }
}
const deleteBlogContent = async(id,author) => {
    const sql = `delete from blogs where id='${id}' and author='${author}';`
    const data =  await exec(sql)
    if(data.affectedRows >0) {
        return true
    } else {
        return false
    }
}
module.exports = {
    getList,
    getDetail,
    addBlogContent,
    updateBlogContent,
    deleteBlogContent
}
