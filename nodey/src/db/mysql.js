const mysql = require('mysql')
const { MYSQL_CONFIG } = require('../conf/db')

const con = mysql.createConnection(MYSQL_CONFIG)

con.connect()

function exec(sql) {
    return new Promise((resolve, reject) => {
        con.query(sql,(err, result) => {
            if (err) {
                reject(err)
                return
            }
            resolve(result)
        })
    })
}
module.exports = {
    exec,
    escape:mysql.escape()
}

