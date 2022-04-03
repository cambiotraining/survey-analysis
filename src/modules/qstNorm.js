const fs = require('fs')
const Papa = require('papaparse')
const stringSimilarity = require('string-similarity')
const path = require('path')

const IDENTIFIERS = [
    {
        outputString: 'ID',
        matcher: {
            keywords: 'Respondent ID',
        },
    },
]

const HEADERS = [
    {
        outputString: 'Where did you see the course advertised?',
        matcher: {
            keywords: 'How did you hear about this event?',
            extraColumn: 'OTHER',
        },
    },
    {
        outputString: 'What is your career stage?',
        matcher: {
            keywords: 'What is your career stage?',
            extraColumn: 'OTHER',
        },
    },
    {
        outputString: 'What is your employment sector?',
        matcher: {
            keywords: 'What is your employment sector?',
            extraColumn: 'OTHER',
        },
    },
    {
        outputString: 'What is your country of employment?',
        matcher: {
            keywords: 'In what country do you work?',
        },
    },
    {
        outputString: 'What is your gender?',
        matcher: {
            keywords: 'What is your gender?',
            extraColumn: 'OTHER',
        },
    },
    {
        outputString:
            'Have you used the tool(s)/resource(s) covered in the course before?',
        matcher: {
            keywords:
                'Have you used the tools/resources covered in the course before?',
            extraColumn: 'FREETEXT',
        },
    },
    {
        outputString:
            'Will you use the tool(s)/resource(s) covered in the course again?',
        matcher: {
            keywords:
                'Will you use the tools/resources covered in the course in your future work?',
            extraColumn: 'FREETEXT',
        },
    },
    {
        outputString: 'Would you recommend the course?',
        matcher: {
            keywords: 'Would you recommend this course?',
            extraColumn: 'FREETEXT',
        },
    },
    {
        outputString:
            'Please tell us your overall rating for the entire course',
        matcher: {
            keywords:
                'Please tell us your overall rating for the entire course.',
            extraColumn: 'FREETEXT',
        },
    },
    {
        outputString:
            'May we contact you by email in the future for more feedback?',
        matcher: {
            keywords:
                'Do you consent to having your name and email recorded for the purposes of future contact as described above?',
        },
    },
    {
        outputString: 'What part of the training did you enjoy the most?',
        matcher: {
            keywords: 'What part of the course did you like the most?',
        },
    },
    {
        outputString: 'What part of the training did you enjoy the least?',
        matcher: {
            keywords: 'What part of the course did you like the least?',
        },
    },
    {
        outputString: 'The balance of theoretical and practical content was',
        matcher: {
            keywords:
                'The balance of theoretical and practical content across the course was',
        },
    },
    {
        outputString:
            'What other topics would you like to see covered in the future?',
        matcher: {
            keywords:
                'What other topics would you like to see covered in future training courses?',
        },
    },
    {
        outputString: 'Any other comments?',
        matcher: {
            keywords: 'Any other comments?',
        },
    },
    {
        outputString: 'Collector ID',
        matcher: {
            keywords: 'Collector ID',
        },
    },
]

const EXTRA_HEADERS = [
    {
        outputString: 'Contact info: ',
        matcher: {
            keywords:
                "Only enter the information below if you selected 'yes' for the above question:",
            extraColumn: 'MULTI',
        },
    },
    {
        outputString:
            'Which Institution or Organisation are you affiliated to?',
        matcher: {
            keywords:
                'Which Institution or Organisation are you affiliated to?',
            extraColumn: 'OTHER',
        },
    },
    {
        outputString:
            'Which University of Cambridge department/institute are you affiliated to?',
        matcher: {
            keywords:
                'Which University of Cambridge department/institute are you affiliated to?',
            extraColumn: 'OTHER',
        },
    },
    {
        outputString: 'Please rate ',
        matcher: {
            keywords: 'Please rate each section of the course.',
            extraColumn: 'MULTI',
        },
    },
]

let pickedColumnsInCurrentFile = []

class QSTNorm {
    processFilesPath(files, output) {
        files.forEach((filePath) => {
            const { csvOutputModel, csvOutputExtra, csvOutputFull } =
                this.processFile(filePath)
            const fileName = path.basename(filePath)

            fs.writeFileSync(
                `${output}/${fileName.replace(/\.csv$/, '.OUT.csv')}`,
                csvOutputModel
            )
            fs.writeFileSync(
                `${output}/${fileName.replace(/\.csv$/, '.EXTRA.csv')}`,
                csvOutputExtra
            )
            fs.writeFileSync(
                `${output}/${fileName.replace(/\.csv$/, '.FULL.csv')}`,
                csvOutputFull
            )
        })
    }

    processFile(filepath) {
        pickedColumnsInCurrentFile = []
        const fileContent = fs.readFileSync(filepath).toString()
        const records = Papa.parse(fileContent, {})
        const csvOutputModel = this.doHeaders(
            HEADERS.concat(IDENTIFIERS),
            records
        )
        const csvOutputExtra = this.doHeaders(
            EXTRA_HEADERS.concat(IDENTIFIERS),
            records,
            true
        )
        const csvOutputFull = this.doHeaders(
            HEADERS.concat(IDENTIFIERS).concat(EXTRA_HEADERS),
            records,
            true
        )
        return {
            csvOutputModel,
            csvOutputExtra,
            csvOutputFull,
        }
    }

    doHeaders(headersSet, records, addRemainingColumns = false) {
        const { fields, rows } = this.processHeaders(
            headersSet,
            records,
            addRemainingColumns
        )

        // sanitizing row data
        const data = rows.map((cols) =>
            cols.map((d) => {
                if (typeof d === 'string') {
                    return d.replaceAll(',', '-')
                }
                return d
            })
        )

        const _fields = fields.map((data) => {
            if (typeof data === 'string') {
                return data.replaceAll(',', '-')
            }
            return data
        })

        const csvOutput = Papa.unparse(
            {
                fields: _fields,
                data,
            },
            {
                delimiter: records.meta.delimiter,
                newline: records.meta.newline,
            }
        )
        return csvOutput
    }

    getDataMatcher(header, headerRows) {
        const newMatcher = {}
        const matchResult = stringSimilarity.findBestMatch(
            header.matcher.keywords,
            headerRows[0]
        )
        newMatcher.columnNumber = matchResult.bestMatchIndex
        pickedColumnsInCurrentFile.push(newMatcher.columnNumber)
        if (header.matcher.extraColumn) {
            newMatcher.extraColumn = header.matcher.extraColumn
            if (header.matcher.extraColumn === 'MULTI') {
                newMatcher.outputString = `${header.outputString}${
                    headerRows[1][newMatcher.columnNumber]
                }`
                newMatcher.extraColumns = []
                for (
                    let i = newMatcher.columnNumber + 1;
                    i < headerRows[0].length;
                    i++
                ) {
                    if (!headerRows[0][i]) {
                        newMatcher.extraColumns.push({
                            columnNumber: i,
                            outputString: `${header.outputString}${headerRows[1][i]}`,
                        })
                        pickedColumnsInCurrentFile.push(i)
                    } else {
                        break
                    }
                }
            } else {
                pickedColumnsInCurrentFile.push(newMatcher.columnNumber + 1)
            }
        }
        return newMatcher
    }

    processHeaders(headersSet, records, addRemainingColumns = false) {
        const headerRows = records.data.slice(0, 2)
        const fields = []
        let rows = Array.from(Array(records.data.length - 2), () => [])
        headersSet.forEach((header) => {
            const cellMatcher = this.getDataMatcher(header, headerRows)
            if (cellMatcher.extraColumn === 'MULTI') {
                fields.push(cellMatcher.outputString)
                cellMatcher.extraColumns.forEach((xColumn) => {
                    fields.push(xColumn.outputString)
                })
            } else {
                fields.push(header.outputString)
            }
            records.data.slice(2).forEach((rowData, index) => {
                let value = rowData[cellMatcher.columnNumber]
                if (
                    cellMatcher.extraColumn &&
                    (rowData[cellMatcher.columnNumber + 1] ||
                        cellMatcher.extraColumn === 'MULTI')
                ) {
                    switch (cellMatcher.extraColumn) {
                        case 'OTHER':
                            value = rowData[cellMatcher.columnNumber + 1]
                            rows[index].push(value)
                            break
                        case 'FREETEXT':
                            value = `${value} __FREETEXT__ ${
                                rowData[cellMatcher.columnNumber + 1]
                            }`
                            rows[index].push(value)
                            break
                        case 'MULTI':
                            rows[index].push(value)
                            cellMatcher.extraColumns.forEach((xColumn) => {
                                rows[index].push(rowData[xColumn.columnNumber])
                            })
                            break
                        default:
                            break
                    }
                } else {
                    rows[index].push(value)
                }
            })
        })
        if (addRemainingColumns) {
            for (let i = 0; i < records.data[0].length; i++) {
                if (!pickedColumnsInCurrentFile.includes(i)) {
                    fields.push(records.data[0][i])
                    records.data.slice(2).forEach((rowData, index) => {
                        rows[index].push(rowData[i])
                    })
                }
            }
        }
        return {
            fields,
            rows,
        }
    }
}

module.exports = QSTNorm
