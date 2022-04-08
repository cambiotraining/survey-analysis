const Papa = require('papaparse')
const fs = require('fs-extra')
const dfd = require('danfojs-node')

/**
 * To build danfo DataFrame from csv file
 *
 * @param {string} filePath File path of csv file
 * @returns {dfd.DataFrame} danfo DataFrame
 */
const buildDataFrameFromCSVFilePath = (filePath) => {
    const rawData = fs.readFileSync(filePath, { encoding: 'utf8' })
    const parseData = Papa.parse(rawData, { header: true })
    const parseDataList = parseData.data.map((data) => Object.values(data))

    return new dfd.DataFrame(parseDataList, {
        columns: Object.keys(parseData.data[0]),
    })
}

/**
 *
 * @param {string} fileList csv file path
 * @returns {dfd.DataFrame} danfo DataFrame
 */
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
