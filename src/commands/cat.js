const Papa = require('papaparse')
const fs = require('fs-extra')
const dfd = require('danfojs-node')
const path = require('path')

const processInputFilePattern = require('../common/process-input-file-pattern')
const logger = require('../utils/logger')
const chalk = require('chalk')

const buildDataFrameFromCSVFilePath = (filePath) => {
    const rawData = fs.readFileSync(filePath, { encoding: 'utf8' })

    const parseData = Papa.parse(rawData, { header: true })
    const parseDataList = parseData.data.map((data) => Object.values(data))

    return new dfd.DataFrame(parseDataList, { columns: parseData.meta.fields })
}

const cat = (args = {}) => {
    const { files: pattern, output = 'output.csv' } = args
    const directory = path.dirname(output)

    const fileList = processInputFilePattern(pattern)

    if (!fileList) {
        return
    }

    if (!fs.existsSync(directory)) {
        logger(chalk.red("Error: Output directory doesn't exist"))
        logger(chalk.cyan(`Make sure directory "${directory}" exists.`))
        return
    }

    const dfList = []

    for (const file of fileList) {
        dfList.push(buildDataFrameFromCSVFilePath(file))
    }

    const combinedDataFrame = dfd.concat({ dfList, axis: 0 })

    const csv = dfd.toCSV(combinedDataFrame)

    fs.writeFileSync(output, csv)

    logger(chalk.blue('Completed!'))
}

module.exports = cat
