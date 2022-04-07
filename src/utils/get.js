const glob = require('glob')

const getFilesPathUsingPattern = (pattern) => {
    return glob.sync(pattern)
}

const getParsedCSVHeaderValue = (text) => {
    if (typeof text !== 'string') {
        return {
            main: text,
            col: '',
        }
    }

    const val = text.split(/[#$]/)

    if (val.length > 1) {
        return {
            main: val[1],
            col: val[3],
        }
    }

    return {
        main: text,
        col: '',
    }
}

module.exports = {
    getFilesPathUsingPattern,
    getParsedCSVHeaderValue,
}
