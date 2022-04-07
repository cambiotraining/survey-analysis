const chalk = require('chalk')
const fs = require('fs-extra')
const Papa = require('papaparse')
const logger = require('./logger')

const sanitize = (text) => {
    if (typeof text !== 'string') return text

    return text.replace(/\s\s+/g, ' ').replace(/[^a-z0-9?/\s]/gi, '')
}

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
