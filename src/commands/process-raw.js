const chalk = require('chalk')
const fs = require('fs-extra')

const processInputFilePattern = require('../common/process-input-file-pattern')
const processOutputDir = require('../common/process-output-dir')
const logger = require('../utils/logger')
const { parseCSV, unparseCSV } = require('../utils/csv')
const { dropEmptyColumns, dropEmptyRows } = require('../utils/df')
const { qstNormGetFull } = require('../modules/qstNorm')
const {
    COMMON_HEADERS,
    IDENTIFIERS_COLUMNS,
    OTHER_HEADERS,
} = require('../constants/columns')

const processRaw = (args) => {
    const { files: pattern, output } = args

    const fileList = processInputFilePattern(pattern)

    // if (!fileList || !processOutputDir(output)) {
    //     return
    // }

    const { flattenHeader, rows } = parseCSV(fileList[0])

    const { header, rows: _rows } = dropEmptyColumns(flattenHeader, rows)
    const { rows: __rows } = dropEmptyRows(_rows)

    qstNormGetFull({
        HEADER_SET: [
            ...COMMON_HEADERS,
            ...IDENTIFIERS_COLUMNS,
            ...OTHER_HEADERS,
        ],
        header,
        rows: __rows,
    })
    // const csvString = unparseCSV(header, __rows)

    // fs.writeFileSync('output.csv', csvString)

    // logger(chalk.bold.white('Process total', fileList.length, 'file(s)'))
    // logger(chalk.blue('Completed!'))
}
module.exports = processRaw
