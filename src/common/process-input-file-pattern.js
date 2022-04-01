const chalk = require('chalk')
const { getFilesPathUsingPattern } = require('../utils/get')

const logger = require('../utils/logger')

const processInputFilePattern = (pattern) => {
    if (typeof pattern !== 'string' || !pattern) {
        logger(chalk.red('Error: -f, --files is required.'))
        return false
    }

    const files = getFilesPathUsingPattern(pattern)

    if (files.length === 0) {
        logger(chalk.bgRed.white('Error: No file found'))
        logger(
            'Please check you files pattern. Given pattern:',
            chalk.blue(pattern)
        )

        return false
    }

    logger(chalk.green(`Total ${files.length} file(s) found.`))

    return files
}

module.exports = processInputFilePattern
