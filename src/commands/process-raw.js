const chalk = require('chalk')

const QSTNorm = require('../modules/qstNorm')
const processInputFilePattern = require('../common/process-input-file-pattern')
const processOutputDir = require('../common/process-output-dir')
const logger = require('../utils/logger')

const processRaw = (args) => {
    const { files: pattern, output } = args

    const files = processInputFilePattern(pattern)

    if (!files || !processOutputDir(output)) {
        return
    }

    const qst = new QSTNorm()
    qst.processFilesPath(files, output)

    logger(chalk.blue('Completed!'))
}
module.exports = processRaw
