const processInputFilePattern = require('../common/process-input-file-pattern')

/**
 * This will help to concatenate multiple csv files into one csv file.
 * Make sure all csv files have same set of headers otherwise the output
 * of this function will now be as expected.
 */
const cat = (args = {}) => {
    const { files: pattern, output = 'output.csv', headerRows = 1 } = args

    const files = processInputFilePattern(pattern)

    if (!files) {
        return
    }
}

module.exports = cat
