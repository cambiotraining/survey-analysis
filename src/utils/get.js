const glob = require('glob')

/**
 * To get the paths that match the pattern
 *
 * @param {string} pattern filepath pattern
 * @returns {string[]} List of paths that match the pattern
 */
const getFilesPathUsingPattern = (pattern) => {
    return glob.sync(pattern)
}

/**
 * To get main and sub heading value.
 *
 * Header value should be the following pattern
 * `[MERGED]#mainHeading#$subHeading$`
 *
 * @param {string} text header string
 * @returns {{main: string, sub: string}} returns main and sub header value
 */
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
