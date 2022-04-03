const Papa = require('papaparse')
const fs = require('fs-extra')
const dfd = require('danfojs-node')

const buildDataFrameFromCSVFilePath = (filePath) => {
    const rawData = fs.readFileSync(filePath, { encoding: 'utf8' })

    const parseData = Papa.parse(rawData, { header: true })
    const parseDataList = parseData.data.map((data) => Object.values(data))

    return new dfd.DataFrame(parseDataList, { columns: parseData.meta.fields })
}

const catUsingFileList = (fileList) => {
    const dfList = []

    for (const file of fileList) {
        dfList.push(buildDataFrameFromCSVFilePath(file))
    }
    const combinedDataFrame = dfd.concat({ dfList, axis: 0 })

    return combinedDataFrame
}

module.exports = {
    catUsingFileList,
    buildDataFrameFromCSVFilePath,
}
