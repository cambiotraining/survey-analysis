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
        logger(chalk.bgRed.white('Error: No input file found'))
        logger(
            chalk.red(
                'Please check you files pattern.',
                'If there are any spaces in the pattern',
                'then consider wrapping it with quotes.'
            )
        )

        return false
    }

    logger(chalk.green(`${files.length} file(s) found.`))

    return files
}

module.exports = processInputFilePattern
