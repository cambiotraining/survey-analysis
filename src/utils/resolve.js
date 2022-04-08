/**
 * Try to resolve header to a known name
 *
 * @param {string} name header name
 * @returns {string} return resolved name
 */
const resolveCommonHeaderNames = (name) => {
    if (typeof name !== 'string') {
        return name
    }

    if (name.search(/Email Address/) !== -1) {
        return 'Contact info: Email'
    }

    if (name.search(/Email/) !== -1) {
        return 'Contact info: Email'
    }

    if (name.trim().search(/^Name$/) !== -1) {
        return 'Contact info: Name'
    }

    return name
}

module.exports = {
    resolveCommonHeaderNames,
}
