const chalk = require('chalk')
const stringSimilarity = require('string-similarity')

const { getParsedCSVHeaderValue } = require('../utils/get')
const logger = require('../utils/logger')
const { COLUMN_TYPE } = require('../constants/columns')

const processOtherColData = (data) => {
    if (data.length === 1) {
        return data[0].colData
    }

    const _data = []
    for (let i = 0; i < data[0].colData.length; i++) {
        const col1 = data[0].colData[i]
        const col2 = data[1].colData[i]

        if (col2 !== '') {
            _data.push(col2)
        } else {
            _data.push(col1)
        }
    }

    return data
}

const processMergeColData = (data) => {
    // if()
}

const processPickedColumns = (columns) => {
    const { MERGE, MULTI, OTHER, SINGLE } = COLUMN_TYPE

    const processedCol = []

    for (const col of columns) {
        switch (col.type) {
            case SINGLE:
                processedCol.push({ ...col, data: col.data[0].colData })
                break
            case OTHER:
                processedCol.push({
                    ...col,
                    data: processOtherColData(col.data),
                })
                break

            case MERGE:
                break
            default:
                break
        }
    }

    logger(processedCol)
}

class QSTNorm {
    columns = []
    header = []
    rows = []

    constructor(header, rows) {
        this.header = header
        this.rows = rows
    }

    prepareColumns() {
        this.columns = []
        const header = this.header
        const rows = this.rows

        if (rows.length === 0) {
            logger(chalk.red('Error: Length of rows is 0'))
            return
        }

        if (header.length === 0) {
            logger(chalk.red('Error: Length of header is 0'))
            return
        }

        for (let i = 0; i < header.length; i++) {
            const currentHeader = header[i]
            const { main, sub } = getParsedCSVHeaderValue(currentHeader)

            const colData = []

            for (let j = 0; j < rows.length; j++) {
                colData.push(rows[j][i])
            }

            if (!(main in this.columns)) {
                this.columns[main] = {
                    data: [{ colName: sub ? sub : main, colData }],
                }
            } else if (sub) {
                this.columns[main] = {
                    data: [
                        ...this.columns[main].data,
                        { colName: sub, colData },
                    ],
                }
            }
        }

        logger(chalk.green('Columns prepared successfully!'))
    }

    processHeader(HEADER_SET) {
        const columnKeys = Object.keys(this.columns)
        const pickedColumns = []

        if (columnKeys.length === 0) {
            logger(
                chalk.red('Error: Run prepareColumns before processing Header')
            )
            return
        }

        for (let i = 0; i < HEADER_SET.length; i++) {
            const CURR_HEADER = HEADER_SET[i]
            const lookingFor = CURR_HEADER.additional.lookFor
            const {
                bestMatchIndex,
                bestMatch: { rating },
            } = stringSimilarity.findBestMatch(lookingFor, columnKeys)

            if (rating > 0.7) {
                pickedColumns.push({
                    ...this.columns[columnKeys[bestMatchIndex]],
                    name: CURR_HEADER.name,
                    type: CURR_HEADER.additional.type,
                })
            }
        }

        processPickedColumns(pickedColumns)
    }
}

module.exports = {
    QSTNorm,
    processPickedColumns,
}
