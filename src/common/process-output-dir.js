const fs = require('fs')
const chalk = require('chalk')
const path = require('path')

const logger = require('../utils/logger')

/**
 * To check output directory existence.
 *
 * @param {string} output output directory name
 * @returns {boolean} whether output directory exists.
 */
const processOutputDir = (output) => {
    if (typeof output !== 'string' || !output) {
        logger(
            chalk.red(
                'Error: -o, --output is required. Please provide output directory'
            )
        )
        return false
    }

    const dirName = path.dirname(output)

    if (!fs.existsSync(dirName)) {
        logger(chalk.red("Error: Output directory doesn't exist."))
        return false
    }

    return true
}

module.exports = processOutputDir
