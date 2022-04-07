const glob = require('glob')

const getFilesPathUsingPattern = (pattern) => {
    return glob.sync(pattern)
}

const getParsedCSVHeaderValue = (text) => {
    if (typeof text !== 'string') {
        return {
            main: text,
            sub: '',
        }
    }

    const val = text.split(/[#$]/)

    if (val.length > 1) {
        return {
            main: val[1],
            sub: val[3],
        }
    }

    return {
        main: text,
        sub: '',
    }
}

module.exports = {
    getFilesPathUsingPattern,
    getParsedCSVHeaderValue,
}
