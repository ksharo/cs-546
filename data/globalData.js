const validator = require('validator');

/*
 * Checks a given variable (str) with name (name) to see if it is valid according
 * to the following rules: 1. It must exist; 2. If strict=true, it must be alphanumeric
 * 3. It must be a string; 4. It must be at least the minimum length; 5. It must not contain any spaces
 */
function checkString(str, name = 'string', strict = false, minLen = 1) {
    try {
        // check if the variable exists
        if (str == undefined) throw `Expected ${name} parameter, but received nothing.`;
        // make sure that it is a string
        if (typeof(str) != 'string') throw `Expected ${name} to be a string, but received ${typeof(str)} instead.`;
        // check if there are spaces in the variable
        if (str.indexOf(' ') != -1) throw `${name} cannot contain any spaces.`;
        // make sure the variable is at least minimum length
        if (str.trim().length < minLen) throw `Expected ${name} to be at least ${minLen} ${minLen==1 ? 'character' : 'characters'}.`;
        // if strict, check for only alphanumeric characters
        if (strict) {
            const alphanum = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            for (let x of str) {
                if (!alphanum.includes(x.toLowerCase())) throw `Expected ${name} to be alphanumeric, but found ${x}.`;
            }
        }
    } catch (e) {
        throw e;
    }
}

/*
 * Similar to checkString, but with more options
 */
function checkAdvancedString(str, name = 'Input', minLength = 1, onlyAlphNum = true, spacesAllowed = false, email = false) {
    /* make sure the string is not empty */
    if (str == undefined || str.trim().length == 0) {
        throw `Error: ${name} cannot be empty.`;
    }
    /* check that the email is valid */
    if (email) {
        if (!validator.isEmail(str)) {
            throw `Error: ${name} must be in email format. Example: john@abc.com`;
        }
    }
    /* make sure the string is at least the required length */
    if (str.trim().length < minLength) {
        throw `Error: ${name} must be at least ${minLength} characters.`;
    }
    /* make sure there are no spaces, if spaces are not allowed */
    if (!spacesAllowed && str.trim().includes(' ')) {
        throw `Error: ${name} cannot contain spaces.`;
    }
    /* make sure there are only numbers and letters */
    if (onlyAlphNum) {
        const alphanum = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        for (let x of str) {
            if (!alphanum.includes(x.toLowerCase())) throw `Error: ${name} can only contain letters and numbers.`;
        }
    }
    return true;
}

module.exports = {
    checkString,
    checkAdvancedString
}