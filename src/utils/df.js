/**
 * Drop empty columns
 *
 * @param {string[]} header header row
 * @param {string[][]} rows rows data
 * @returns {{header: string[], rows: string[][]}}
 */
const dropEmptyColumns = (header, rows) => {
    const emptyCols = {}

    for (let i = 0; i < rows[0].length; i++) {
        let isEmpty = true
        for (let j = 0; j < rows.length; j++) {
            if (rows[j][i] !== NaN && rows[j][i] !== '') {
                isEmpty = false
                break
            }
        }

        if (isEmpty) {
            emptyCols[i] = i
        }
    }

    const _header = header.filter((_, idx) => !(idx in emptyCols))
    const _rows = rows.map((d) => d.filter((_, idx) => !(idx in emptyCols)))

    return {
        header: _header,
        rows: _rows,
    }
}

/**
 *
 * @param {string[][]} rows
 * @returns {{rows: string[][]}}
 */
const dropEmptyRows = (rows) => {
    return {
        rows: rows.filter((row) => row.join('').replace(/NaN/g, '') !== ''),
    }
}

/**
 *
 * @param {string[][]} rows rows
 * @param {string | number} value value to fill
 * @returns {{rows: string[][]}} processed rows
 */
const fillNaN = (rows, value = '') => {
    return {
        rows: rows.map((row) =>
            row.map((c) => {
                if (Number.isNaN(c)) {
                    return value
                }
                return c
            })
        ),
    }
}

module.exports = {
    dropEmptyColumns,
    dropEmptyRows,
    fillNaN,
}
