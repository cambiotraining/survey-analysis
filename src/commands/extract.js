const chalk = require('chalk')
const fs = require('fs-extra')
const dfd = require('danfojs-node')

const processInputFilePattern = require('../common/process-input-file-pattern')
const logger = require('../utils/logger')
const { catUsingFileList } = require('../utils/concatnate')
const processOutputDir = require('../common/process-output-dir')
const { fillNaN } = require('../utils/df')

/**
 *
 * @param {string} data string containing date
 * @returns {string} date
 */
const getDate = (data) => {
    // Multiple date
    let match = data.match(/[\d+\s*]{5,}[a-zA-Z]*\s*\d{4}/i)

    if (match) {
        return match[0]
    }

    match = data.match(/\d+\s*-\s*\d+\s*[a-zA-Z]*\s*\d{4}/i)
    if (match) {
        return match[0]
    }
    // Might have only one date
    match = data.match(/\d+\s*\s*[a-zA-Z]*\s*\d{4}/i)
    if (match) {
        return match[0]
    }

    // Without year
    match = data.match(/\d+\s*-\s*\d+\s*[a-zA-Z]*/i)
    if (match) {
        return match[0]
    }

    return ''
}
/**
 *
 * @param {string[]} row row data
 * @returns {string[]} processed rows
 */
const getCustomColData = (row) => {
    const meta = JSON.parse(row[2])
    const date = getDate(meta.fileName)
    const name = date ? meta.fileName.split(date)[0] ?? '' : meta.fileName
    return [date, name.trim(), '', '', '', '']
}

/**
 *
 * @typedef {object} ExtractContactArgs
 * @property {string[]} files file paths
 * @property {string} output output file name
 */

/**
 *
 * @param {ExtractContactArgs} args extract contact args
 */
const extractContact = (args) => {
    const { files, output } = args
    const df = catUsingFileList(files, { addMetaData: true })

    const columns = df.columns.filter((col) => {
        if (
            col.search(/Contact info:/i) !== -1 ||
            col.search(/meta data/i) !== -1
        ) {
            return true
        }

        return false
    })

    if (columns.length === 0) {
        logger(chalk.red('Error: No contact column found'))
        return
    }

    const values = fillNaN(df.loc({ columns }).values).rows

    const headers = [
        'Email',
        'First Name',
        'Last Name',
        'Custom 1',
        'Custom 2',
        'Custom 3',
        'Custom 4',
        'Custom 5',
        'Custom 6',
    ]

    const rows = []

    /**
     * Columns order in values is:
     * Name --- Email --- Meta Data
     *
     * Expected
     * Email --- First Name --- LastName --- Custom 1 2 3 4 5 6
     */

    for (const r of values) {
        const row = []

        row.push(r[1]) // Email Address

        const [firstName, ...lastName] = r[0].split(' ')
        row.push(firstName ?? '') // First Name
        row.push(lastName.join(' ')) // Last Name

        if (row.join('') !== '') {
            // Only pushing if not empty.
            row.push(...getCustomColData(r))

            // Updating rows.
            rows.push(row)
        }
    }

    const contactDf = new dfd.DataFrame(rows, { columns: headers })

    contactDf.print()

    logger(
        chalk.bold.white(
            'Rows:',
            contactDf.shape[0],
            'Columns:',
            contactDf.shape[1]
        )
    )

    if (output) {
        if (processOutputDir(output)) {
            const csvString = contactDf.toCSV()
            fs.writeFileSync(output, csvString)
            logger(chalk.green('Write successfully to', output))
        }
    }

    logger(chalk.blue('Completed!'))
}

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
    }

    const { files: pattern, output } = other

    const files = processInputFilePattern(pattern)

    if (!files) {
        return
    }

    switch (extractType) {
        case 'contact':
            extractContact({
                files,
                output,
            })
            break
        default:
            logger(chalk.bold.red('Error: This tool can only extract contact.'))
    }
}

module.exports = extract
