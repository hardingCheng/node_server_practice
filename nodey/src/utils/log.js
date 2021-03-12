const fs =  require('fs');
const path = require('path');
function writeLog(accessWriteStream,log) {
    accessWriteStream.write(log + '\n')
}
function createWriteStream(filename) {
    const fullFilename = path.join(__dirname, '../' ,'../','logs',filename)
    return fs.createWriteStream(fullFilename, {
        flags: 'a'
    })
}
const accessWriteStream = createWriteStream('access.log')
function access(log) {
    writeLog(accessWriteStream,log)
}

module.exports = {
    access
}
