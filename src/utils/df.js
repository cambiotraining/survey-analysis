const dfd = require('danfojs-node')

const dropEmptyColumns = (header, rows) => {
    const emptyCols = {}

    for (let i = 0; i < rows[0].length; i++) {
        let isEmpty = true
        for (let j = 0; j < rows.length; j++) {
            if (rows[j][i] !== '') {
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

const dropEmptyRows = (rows) => {
    return {
        rows: rows.filter((row) => row.join('') !== ''),
    }
}

module.exports = {
    dropEmptyColumns,
    dropEmptyRows,
}
