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
