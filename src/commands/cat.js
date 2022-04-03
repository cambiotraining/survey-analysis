const fs = require('fs-extra')
const dfd = require('danfojs-node')
const path = require('path')
const chalk = require('chalk')

const processInputFilePattern = require('../common/process-input-file-pattern')
const logger = require('../utils/logger')
const { catUsingFileList } = require('../utils/concatnate')

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

    const df = catUsingFileList(fileList)

    const csv = dfd.toCSV(df)

    fs.writeFileSync(output, csv)

    logger(chalk.bold.white('Rows:', df.shape[0], 'Columns:', df.shape(1)))
    logger(chalk.blue('Completed!'))
}

module.exports = cat
