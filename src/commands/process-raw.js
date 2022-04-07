const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')

const processInputFilePattern = require('../common/process-input-file-pattern')
const processOutputDir = require('../common/process-output-dir')
const logger = require('../utils/logger')
const { parseCSV, unparseCSV } = require('../utils/csv')
const { dropEmptyColumns, dropEmptyRows } = require('../utils/df')
const { QSTNorm } = require('../modules/qstNorm')
const {
    COMMON_HEADERS,
    IDENTIFIERS_COLUMNS,
    OTHER_HEADERS,
    ADDITIONAL_HEADERS,
} = require('../constants/columns')

const processSingleFile = (filePath) => {
    const { flattenHeader, rows } = parseCSV(filePath)

    const { header, rows: _rows } = dropEmptyColumns(flattenHeader, rows)
    const { rows: __rows } = dropEmptyRows(_rows)

    const qstNorm = new QSTNorm(header, __rows)

    qstNorm.prepareColumns()

    const { headers: fullHeader, rows: fullRows } = qstNorm.processHeader([
        ...COMMON_HEADERS,
        ...IDENTIFIERS_COLUMNS,
        ...OTHER_HEADERS,
        ...ADDITIONAL_HEADERS,
    ])

    const { headers: outHeader, rows: outRows } = qstNorm.processHeader([
        ...OTHER_HEADERS,
        ...IDENTIFIERS_COLUMNS,
        ...ADDITIONAL_HEADERS,
    ])

    const { headers: extraHeader, rows: extraRows } = qstNorm.processHeader([
        ...COMMON_HEADERS,
        ...IDENTIFIERS_COLUMNS,
        ...ADDITIONAL_HEADERS,
    ])

    const full = unparseCSV(fullHeader, fullRows)
    const out = unparseCSV(outHeader, outRows)
    const extra = unparseCSV(extraHeader, extraRows)

    return {
        full,
        out,
        extra,
    }
}

const processRaw = (args) => {
    const { files: pattern, output } = args

    const fileList = processInputFilePattern(pattern)

    if (!fileList || !processOutputDir(output)) {
        return
    }

    for (const filePath of fileList) {
        const { full, extra, out } = processSingleFile(filePath)
        const fileName = path.basename(filePath)

        fs.writeFileSync(
            `${output}/${fileName.replace(/\.csv$/, '.OUT.csv')}`,
            out
        )
        fs.writeFileSync(
            `${output}/${fileName.replace(/\.csv$/, '.EXTRA.csv')}`,
            extra
        )
        fs.writeFileSync(
            `${output}/${fileName.replace(/\.csv$/, '.FULL.csv')}`,
            full
        )
    }

    logger(chalk.bold.white('Process total', fileList.length, 'file(s)'))
    logger(chalk.blue('Completed!'))
}
module.exports = processRaw
