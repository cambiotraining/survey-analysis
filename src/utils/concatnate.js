const Papa = require('papaparse')
const fs = require('fs-extra')
const dfd = require('danfojs-node')
const path = require('path')

/**
 * @typedef {object} CatOptions
 * @property {boolean} addMetaData add meta data
 */

/**
 * To build danfo DataFrame from csv file
 *
 * @param {string} filePath File path of csv file
 * @param {CatOptions} option Cat options
 * @returns {dfd.DataFrame} danfo DataFrame
 */
const buildDataFrameFromCSVFilePath = (filePath, option) => {
    const rawData = fs.readFileSync(filePath, { encoding: 'utf8' })
    const parseData = Papa.parse(rawData, { header: true })
    const rows = parseData.data.map((data) => Object.values(data))

    const columns = Object.keys(parseData.data[0])

    if (option.addMetaData) {
        console.log('Adding meta data')
        columns.push('Meta Data')

        const meta = JSON.stringify({
            fileName: path.basename(filePath),
        })

        for (const row of rows) {
            row.push(meta)
        }
    }

    return new dfd.DataFrame(rows, {
        columns,
    })
}

/**
 *
 * @param {string} fileList csv file path
 * @param {CatOptions} options cat option
 * @returns {dfd.DataFrame} danfo DataFrame
 */
const catUsingFileList = (fileList, options) => {
    const dfList = []

    for (const file of fileList) {
        dfList.push(buildDataFrameFromCSVFilePath(file, options))
    }
    const combinedDataFrame = dfd.concat({ dfList, axis: 0 })

    return combinedDataFrame
}

module.exports = {
    catUsingFileList,
    buildDataFrameFromCSVFilePath,
}
