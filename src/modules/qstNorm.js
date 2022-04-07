const stringSimilarity = require('string-similarity')

const { getParsedCSVHeaderValue } = require('../utils/get')
const logger = require('../utils/logger')

const qstNormGetFull = ({ HEADER_SET, header, rows }) => {
    const columns = {}
    for (let i = 0; i < header.length; i++) {
        const currentHeader = header[i]
        const { main, sub } = getParsedCSVHeaderValue(currentHeader)

        const colData = []

        for (let j = 0; j < rows.length; j++) {
            colData.push(rows[j][i])
        }

        if (!(main in columns)) {
            columns[main] = {
                data: [{ colName: sub ? sub : main, colData }],
            }
        } else if (sub) {
            columns[main] = {
                data: [...columns[main].data, { colName: sub, colData }],
            }
        }
    }

    const columnKeys = Object.keys(columns)

    for (let i = 0; i < HEADER_SET.length; i++) {
        const lookingFor = HEADER_SET[i].additional.lookFor

        const { bestMatchIndex } = stringSimilarity.findBestMatch(
            lookingFor,
            columnKeys
        )

        logger(
            'Finding',
            lookingFor,
            'Match',
            similarity.bestMatchIndex,
            similarity.bestMatch.rating
        )
    }
}

module.exports = {
    qstNormGetFull,
}
