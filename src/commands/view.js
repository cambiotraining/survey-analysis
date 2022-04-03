const chalk = require('chalk')
const dfd = require('danfojs-node')

const processInputFilePattern = require('../common/process-input-file-pattern')
const logger = require('../utils/logger')

const view = async (args = {}) => {
    const { file: pattern, rows, columns, tail, head } = args
    let _rows
    let _columns

    const files = processInputFilePattern(pattern)

    if (!files) {
        return
    }

    let df = await dfd.readCSV(files[0])

    if (head) {
        df = df.head(Number.parseInt(head))
    } else if (tail) {
        df = df.tail(Number.parseInt(tail))
    }

    if (rows) {
        _rows = rows.map((i) => Number.parseInt(i))
    }

    if (columns) {
        _columns = columns.map((i) => Number.parseInt(i))
    }

    if (_rows || _columns) {
        df = df.iloc({ rows: _rows, columns: _columns })
    }

    df.print()

    logger(
        chalk.bold.whiteBright('Rows:', df.shape[0], '\nColumns:', df.shape[1])
    )
}

module.exports = view
