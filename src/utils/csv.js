const chalk = require('chalk')
const fs = require('fs-extra')
const Papa = require('papaparse')
const logger = require('./logger')

/**
 *
 * @typedef {object} ParsedCSV
 * @property {Array<Array<string>>} headers header rows
 * @property {Array<string>} flattenHeader header row
 * @property {Array<Array<string>>} rows rows data
 */

/**
 * To sanitize string. It will remove anything
 * other than alphabets, digit, @abstract, _, ., ?, -
 * and space.
 *
 * @param {string} text string
 * @returns {string} returns sanitized string
 */
const sanitize = (text) => {
    if (typeof text !== 'string') return text

    return text
        .replaceAll('/', '')
        .replace(/\s\s+/g, ' ')
        .replace(/[^a-z0-9@_.-?/\s]/gi, '')
}

/**
 *
 * @param {string} filePath path of csv file
 * @returns {ParsedCSV} parsed csv
 */
const parseCSV = (filePath) => {
    const headerRows = 2
    const rawFileData = fs.readFileSync(filePath, { encoding: 'utf-8' })
    const csv = Papa.parse(rawFileData)

    if (headerRows > csv.data.length) {
        logger(
            chalk.red(
                'Error: headerRows is greater the rows in CSV file',
                'Got headerRows:',
                headerRows,
                'Rows in csv file',
                csv.data.length
            )
        )
        return
    }
    const rawCSVRows = csv.data
    const headers = []
    const rows = []
    let flattenHeader = []

    for (let i = 0; i < headerRows; i++) {
        const data = rawCSVRows[i].map((text) => sanitize(text))
        headers.push(sanitize(data))
    }

    for (let i = headerRows; i < rawCSVRows.length; i++) {
        const data = rawCSVRows[i].map((text) => sanitize(text))
        if (data.length === rawCSVRows[0].length) {
            rows.push(data)
        }
    }

    let lastColValue = headers[0][0]
    for (let i = 0; i < headers[0].length; i++) {
        const row = headers[0]
        lastColValue = row[i] !== '' ? row[i] : lastColValue
        const secondRowColValue = headers[1][i]
        flattenHeader[i] =
            secondRowColValue === ''
                ? lastColValue
                : `[MERGED]: #${lastColValue}#$${secondRowColValue}$`
    }

    return {
        headers,
        rows,
        flattenHeader,
    }
}

/**
 *
 * @param {Array<Array<string>>} header header row
 * @param {Array<Array<string>>} rows rows data
 * @returns {string} csv string
 */
const unparseCSV = (header, rows) => {
    return Papa.unparse({
        data: rows,
        fields: header,
    })
}

module.exports = {
    parseCSV,
    unparseCSV,
    sanitize,
}
