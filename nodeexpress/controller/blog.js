const { exec } = require('../db/mysql')
const getList = (author,keyword) => {
   let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like  '%${keyword}%' `
    }
    sql += `order by createtime desc;`
    return exec(sql)
}
const getDetail = (id) => {
    const sql = `select * from blogs where id='${id}'`
    return exec(sql).then((rows) => {
        return rows[0]
    })
}
const addBlogContent = (blogContent = {}) => {
    const { title,content,author } = blogContent
    const createtime = Date.now()
    const sql =  `insert into blogs (title,content,createtime,author) values ('${title}','${content}',${createtime},'${author}');`
    return exec(sql).then((data) => {
        return {
            id: data.insertId
        }
    })
}
const updateBlogContent = (id,blogContent = {}) => {
    const { title,content } = blogContent
    const sql = `update blogs set title='${title}',content='${content}' where id=${id};`
    return exec(sql).then((data) => {
        if(data.affectedRows >0) {
            return true
        } else {
            return false
        }
    })
}
const deleteBlogContent = (id,author) => {
    const sql = `delete from blogs where id='${id}' and author='${author}';`
    return exec(sql).then((data) => {
        if(data.affectedRows >0) {
            return true
        } else {
            return false
        }
    })
}
module.exports = {
    getList,
    getDetail,
    addBlogContent,
    updateBlogContent,
    deleteBlogContent
}
