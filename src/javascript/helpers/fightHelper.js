/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
export function createReferenceObject(array) {
    const referenceObject = {};
    array.forEach(element => {
        referenceObject[element] = false;
    });
    console.log(referenceObject);
    return referenceObject;
}

/**
 * Set state for passed control.
 * @param {*} reference Object or array to inspect.
 * @param {*} state Desired state for property.
 * @param {*} target Object where to store state (if not given, value is deducted from `reference`).
 * @param {*} searchCriteria Whether the array parsing should be done by `key` or by `value`.
 * @param {*} searchValue Self explanatory.
 */
export function setControlState(reference, state, target, searchCriteria, searchValue) {
    // console.log(`Array.isArray(${reference})?`, Array.isArray(reference));
    if (Array.isArray(reference)) {
        return reference.every(item => target[item] === state);
    }
    const property = Object.keys(reference).find(item =>
        searchCriteria === 'key' ? reference[item] : item === searchValue
    );
    if (!target) {
        reference[property] = state;
    } else {
        // console.log('target?', target);
        // console.log('property?', property);
        target[property] = state;
    }
    return true;
}
