const fs =  require('fs');
const path = require('path');
const readline = require('readline');
const fullFilename = path.join(__dirname, '../' ,'../','logs','access.log')

const readStream = fs.createReadStream(fullFilename)
const readl = readline.createInstance({
    input:readStream
})

let chromeNum = 0
let sum = 0

readl.on('line',(linedata) => {
    if(!linedata) {
        return
    }
    sum++
    const arr = linedata.split('--')
    if (arr[2]&&arr[2].indexOf('Chrome') > 0) {
        chromeNum++
    }
})
readl.on('end',() => {
    console.log('chrome 占比：'+chromeNum/sum.toFixed(3))
})
