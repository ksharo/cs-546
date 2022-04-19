const mongoCollections = require('../config/mongoCollections');
const usersDb = mongoCollections.users;
const bcrypt = require('bcryptjs');
const saltRounds = 4;

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
        if (str.trim().length < minLen) throw `Expected ${name} to be at least ${minLen} characters.`;
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
 * Creates a user in the database if username is unique.
 */
async function createUser(username, password) {
    try {
        /* check that the parameters are valid */
        checkString(username, 'username', true, 4);
        checkString(password, 'password', false, 6);

        /* get the user database info */
        const userCollection = await usersDb();

        /* check if there is already a user with username in the database */
        let hasUsername = await userCollection.findOne({ username: username.toLowerCase() });
        if (hasUsername != undefined && hasUsername != null) throw `Username ${username} already exists.`;

        /* hash the password */
        const hash = await bcrypt.hash(password, saltRounds);

        /* create the new user and insert into the database */
        const newUser = {
            username: username.toLowerCase(),
            password: hash
        }

        const inserted = await userCollection.insertOne(newUser);
        if (!inserted.acknowledged || !inserted.insertedId) {
            throw `Failed to create account with username ${username}`;
        }
        return { userInserted: true };
    } catch (e) {
        throw e;
    }
}

async function checkUser(username, password) {
    try {
        /* check that the parameters are valid */
        checkString(username, 'username', true, 4);
        checkString(password, 'password', false, 6);

        /* get the user database info */
        const userCollection = await usersDb();

        /* query the database for the username */
        let hasUsername = await userCollection.findOne({ username: username.toLowerCase() });
        if (hasUsername == undefined || hasUsername == null) throw `Either the username or password is invalid`;

        /* username was found, check password */
        const user = hasUsername;
        let compare = false;
        try {
            compare = await bcrypt.compare(password, user.password);
        } catch (e) {
            throw e;
        }

        /* passwords match! */
        if (compare) {
            return { authenticated: true };
        }
        /* passwords do not match */
        else {
            throw `Either the username or password is invalid`;
        }
    } catch (e) {
        throw e;
    }
}

module.exports = {
    createUser,
    checkUser,
    checkString
}