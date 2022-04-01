const glob = require('glob')
const chalk = require('chalk')

const logger = require('../utils/logger')

/**
 * This will help to concatenate multiple csv files into one csv file.
 * Make sure all csv files have same set of headers otherwise the output
 * of this function will now be as expected.
 */
const cat = (args = {}) => {
    const { files: filePath, output = 'output.csv', headerRows = 1 } = args

    if (!filePath) {
        logger(chalk.red('-f, --files is required.'))
        return
    }

    const files = glob.sync(filePath)

    if (files.length === 0) {
        logger(chalk.bgRed.white('No file found'))
        logger(
            'Please check you files pattern. Given pattern:',
            chalk.blue(filePath)
        )
        return
    }

    logger(chalk.green(`Total ${files.length} file(s) found.`))
}

module.exports = cat
