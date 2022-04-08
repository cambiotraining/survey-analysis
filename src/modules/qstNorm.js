const chalk = require('chalk')
const stringSimilarity = require('string-similarity')

const { getParsedCSVHeaderValue } = require('../utils/get')
const logger = require('../utils/logger')
const { COLUMN_TYPE } = require('../constants/columns')

/**
 * @typedef {object} HeaderSetColumnType
 * @property {string} name header name
 * @property {object} additional additional property
 * @property {string} additional.lookFor pattern to look for
 * @property {string} additional.type columns type
 */

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

    return _data
}

const processMergeColData = (data) => {
    if (data.length === 1) {
        return data[0].colData
    }

    const _data = []
    for (let i = 0; i < data[0].colData.length; i++) {
        const col1 = data[0].colData[i]
        const col2 = data[1].colData[i]
        if (col1 === '' && col2 === '') {
            _data.push('')
        } else if (col2 === '') {
            _data.push(col1)
        } else if (col1 === '') {
            _data.push(col2)
        } else {
            _data.push(`${col1} __FREETEXT__ ${col2}`)
        }
    }

    return _data
}

const processMultiColData = (col) => {
    const prefix = col.name
    const data = []
    for (const d of col.data) {
        data.push({
            name: `${prefix} ${d.colName}`,
            data: d.colData,
        })
    }

    return data
}

const processUnknownCol = (col) => {
    switch (col.data.length) {
        case 1:
            return [
                {
                    name: col.name,
                    data: col.data[0].colData,
                },
            ]

        case 2:
            /**
             * It may be merge or other.
             * We will try to find if second col has any word similar to other.
             * If it has other then there is high chance that it is OTHER type.
             *
             * If it has something similar to comment the it is MERGE column.
             * else we will process it as multiColData
             */
            if (col.data[1].colName.search(/other.*specify/i) !== -1) {
                return [
                    {
                        name: col.name,
                        data: processOtherColData(col.data),
                    },
                ]
            }
            if (col.data[1].colName.search(/comment/i) !== -1) {
                return [
                    {
                        name: col.name,
                        data: processMergeColData(col.data),
                    },
                ]
            }

            return processMultiColData(col)

        default:
            return processMultiColData(col)
    }
}

const processPickedColumns = (columns) => {
    const { MERGE, MULTI, OTHER, SINGLE, UNKNOWN } = COLUMN_TYPE

    const processedCol = []

    for (const col of columns) {
        switch (col.type) {
            case SINGLE:
                processedCol.push({ name: col.name, data: col.data[0].colData })
                break

            case OTHER:
                processedCol.push({
                    name: col.name,
                    data: processOtherColData(col.data),
                })
                break

            case MERGE:
                processedCol.push({
                    name: col.name,
                    data: processMergeColData(col.data),
                })
                break

            case MULTI:
                processedCol.push(...processMultiColData(col))
                break

            case UNKNOWN:
                processedCol.push(...processUnknownCol(col))
                break
            default:
                break
        }
    }

    return processedCol
}

const getHeaderAndRow = (processedCols) => {
    const headers = []
    const rows = []

    for (const col of processedCols) {
        headers.push(col.name)
    }

    for (let i = 0; i < processedCols[0].data.length; i++) {
        const row = []
        for (let j = 0; j < processedCols.length; j++) {
            row[j] = processedCols[j].data[i]
        }
        rows.push(row)
    }

    return {
        headers,
        rows,
    }
}

class QSTNorm {
    /**
     * @type {string[]}
     */
    columns = []
    /**
     * @type {string[]}
     */
    header = []
    header = []
    /**
     * @type {string[]}[]
     */
    rows = []

    constructor(header, rows) {
        this.header = header
        this.rows = rows
    }

    /**
     * To prepare columns for processing
     */
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
    }

    /**
     * @typedef {object} ProcessHeaderOptions
     * @property {boolean} appendUnknownColumns
     */
    /**
     * To process header
     *
     * @param {HeaderSetColumnType[]} HEADER_SET header set
     * @param {ProcessHeaderOptions} option options
     * @returns
     */
    processHeader(HEADER_SET, option = {}) {
        const columnKeys = Object.keys(this.columns)

        if (columnKeys.length === 0) {
            logger(
                chalk.red('Error: Run prepareColumns before processing Header')
            )
            return
        }

        const { appendUnknownColumns = false } = option

        const pickedColumns = []
        const pickedColumnsKey = {}

        for (let i = 0; i < HEADER_SET.length; i++) {
            const CURR_HEADER = HEADER_SET[i]
            const lookingFor = CURR_HEADER.additional.lookFor
            const {
                bestMatchIndex,
                bestMatch: { rating },
            } = stringSimilarity.findBestMatch(lookingFor, columnKeys)

            if (rating > 0.7) {
                pickedColumnsKey[bestMatchIndex] = columnKeys[bestMatchIndex]
                pickedColumns.push({
                    ...this.columns[columnKeys[bestMatchIndex]],
                    name: CURR_HEADER.name,
                    type: CURR_HEADER.additional.type,
                })
            }
        }

        if (appendUnknownColumns) {
            const unknownColumns = columnKeys.filter(
                (_, idx) => !(idx in pickedColumnsKey)
            )

            for (const col of unknownColumns) {
                pickedColumns.push({
                    ...this.columns[col],
                    name: col,
                    type: COLUMN_TYPE.UNKNOWN,
                })
            }
        }

        const processedCols = processPickedColumns(pickedColumns)
        return getHeaderAndRow(processedCols)
    }
}

module.exports = {
    QSTNorm,
    processPickedColumns,
}
