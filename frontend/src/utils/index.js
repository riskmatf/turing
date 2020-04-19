import _ from 'lodash'

function combineClasses(originalClasses, classesToAdd) {
    if (_.isNil(originalClasses) || _.isNil(classesToAdd)) throw new Error('Both classes should be non null')

    if (typeof(originalClasses) === 'string' && typeof(classesToAdd) === 'string') {
        return `${originalClasses} ${classesToAdd}`
    }

    if (typeof(originalClasses) === 'object' && typeof(classesToAdd) === 'object') {
        return {...originalClasses, ...classesToAdd}
    }

    let classesInObjectFromat = null
    let classesInStringFormat = null
    if (typeof(originalClasses) === 'object') {
        classesInObjectFromat = originalClasses
        classesInStringFormat = classesToAdd
    } else if (typeof(classesToAdd) === 'object') {
        classesInObjectFromat = classesToAdd
        classesInStringFormat = originalClasses
    } else {
        throw new Error(`Unsupported operand types ${typeof(originalClasses)} and ${typeof(classesToAdd)}`)
    }

    return _.reduce(_.split(classesInStringFormat, ' '), (previousValue, singleClass) => {
        previousValue[singleClass] = true
    }, classesInObjectFromat)
}


export {
    combineClasses,
}