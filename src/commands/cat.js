const fs = require('fs-extra')
const dfd = require('danfojs-node')
const chalk = require('chalk')

const processInputFilePattern = require('../common/process-input-file-pattern')
const logger = require('../utils/logger')
const { catUsingFileList } = require('../utils/concatnate')
const processOutputDir = require('../common/process-output-dir')

const cat = (args = {}) => {
    const { files: pattern, output = 'output.csv' } = args

    const fileList = processInputFilePattern(pattern)

    if (!fileList) {
        return
    }

    if (!processOutputDir(output)) {
        return
    }

    const df = catUsingFileList(fileList)

    const csv = dfd.toCSV(df)

    fs.writeFileSync(output, csv)

    logger(chalk.bold.white('Rows:', df.shape[0], 'Columns:', df.shape[1]))
    logger(chalk.blue('Completed!'))
}

module.exports = cat
