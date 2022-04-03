const chalk = require('chalk')

const processInputFilePattern = require('../common/process-input-file-pattern')
const logger = require('../utils/logger')
const { catUsingFileList } = require('../utils/concatnate')

const extract = (extractType, other) => {
    if (extractType !== 'contact') {
        logger(chalk.bold.red('Error: This tool can only extract contact.'))
        return
    }

    const { files: pattern } = other

    const files = processInputFilePattern(pattern)

    if (!files) {
        return
    }

    const df = catUsingFileList(files)

    df.columns(['Contact info: Name']).print()
    // df.print()
    // df.print()
}

module.exports = extract
