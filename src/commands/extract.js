const chalk = require('chalk')
const fs = require('fs-extra')

const processInputFilePattern = require('../common/process-input-file-pattern')
const logger = require('../utils/logger')
const { catUsingFileList } = require('../utils/concatnate')
const processOutputDir = require('../common/process-output-dir')

/**
 *
 * @typedef {object} ExtractArgs
 * @property {string} files file path pattern
 * @property {string} output output file name
 */

/**
 * To extract specific data from processed
 * csv files.
 *
 * @param {'contact'} extractType what to extract
 * @param {ExtractArgs} other extract arguments
 */
const extract = (extractType, other) => {
    if (extractType !== 'contact') {
        logger(chalk.bold.red('Error: This tool can only extract contact.'))
        return
    }

    const { files: pattern, output } = other

    const files = processInputFilePattern(pattern)

    if (!files) {
        return
    }

    const df = catUsingFileList(files)
    const columns = df.columns.filter(
        (col) => col.search(/Contact info:/i) !== -1
    )

    const columnsName = {}

    for (const col of columns) {
        columnsName[col] = col.replace(/Contact info:/, '').trim()
    }

    const contactDf = df.loc({ columns })
    contactDf.rename(columnsName, { inplace: true })

    contactDf.print()

    if (output) {
        if (processOutputDir(output)) {
            const csvString = contactDf.toCSV()
            fs.writeFileSync(output, csvString)
            logger(chalk.green('Write successfully to', output))
        }
    }
}

module.exports = extract
