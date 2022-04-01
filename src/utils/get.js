const glob = require('glob')

const getFilesPathUsingPattern = (pattern) => {
    return glob.sync(pattern)
}

module.exports = {
    getFilesPathUsingPattern,
}
