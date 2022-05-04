const mongoCollections = require('../config/mongoCollections');
const usersDb = mongoCollections.users;
const bcrypt = require('bcryptjs');
const saltRounds = 4;
const validator = require('validator');
const { ObjectId } = require('mongodb');

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

/*
 * Creates a user in the database if username and email are unique.
 */
async function createUser(firstName, lastName, email, username, password) {
    try {
        /* check that the parameters are valid */
        checkAdvancedString(firstName, 'First Name', 1);
        checkAdvancedString(lastName, 'Last Name', 1);
        checkAdvancedString(email, 'Email', 6, false, false, true);
        checkAdvancedString(username, 'Screen Name', 6);
        checkAdvancedString(password, 'Password', 6, false, false, false);

        /* get the user database info */
        const userCollection = await usersDb();

        /* check if there is already a user with username in the database */
        let hasUsername = await userCollection.findOne({ screen_name: username.toLowerCase() });
        if (hasUsername != undefined && hasUsername != null) throw `Screen name ${username} has already been claimed. Please choose a different screen name.`;

        /* check if there is already a user with email in the database */
        let hasEmail = await userCollection.findOne({ email: email.toLowerCase() });
        if (hasEmail != undefined && hasEmail != null) throw `An account with username ${email} already exists.`;

        /* hash the password */
        const hash = await bcrypt.hash(password, saltRounds);

        /* create the new user and insert into the database */
        const newUser = {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            profile_pic: '',
            email: email,
            liked_shows: [],
            disliked_shows: [],
            watched_shows: [],
            screen_name: username.toLowerCase(),
            hashed_password: hash
        }

        const inserted = await userCollection.insertOne(newUser);
        if (!inserted.acknowledged || !inserted.insertedId) {
            throw `Failed to create account with username ${username}`;
        }
        return { userInserted: true, data: newUser };
    } catch (e) {
        throw e;
    }
}

/*
 * Attempts to edit a user in the database.
 */
async function editUser(firstName, lastName, email, oldUsername, newUsername, imgLink) {
    try {
        /* check that the parameters are valid */
        checkAdvancedString(firstName, 'First Name', 1);
        checkAdvancedString(lastName, 'Last Name', 1);
        checkAdvancedString(email, 'Email', 6, false, false, true);
        checkAdvancedString(newUsername, 'Screen Name', 6);

        /* get the user database info */
        const userCollection = await usersDb();

        /* check if there is already a user with username in the database if the username has been changed */
        if (oldUsername.trim() != newUsername.trim()) {
            let hasUsername = await userCollection.findOne({ screen_name: newUsername.toLowerCase() });
            if (hasUsername != undefined && hasUsername != null) throw `Screen name ${newUsername} has already been claimed. Please choose a different screen name.`;
        }

        /* update the  user in the database */
        const updatedUser = {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            profile_pic: imgLink,
            email: email,
            screen_name: newUsername.toLowerCase(),
        }

        const updated = await userCollection.updateOne({ email: email }, { $set: updatedUser });
        if (updated.matchedCount == 0 || updated.modifiedCount == 0) {
            throw `Failed to update account.`;
        }

        /* get the user to return the data */
        const result = await userCollection.findOne({ email: email });
        if (result == null || result == undefined) {
            throw `Failed to fetch user after update.`;
        }
        return { userUpdated: true, data: result };
    } catch (e) {
        throw e;
    }
}

/*
 * Given a username (email) and password, checks that the user's credentials are valid
 */
async function checkUser(username, password) {
    try {
        /* check that the parameters are valid */
        checkAdvancedString(username, 'username', 6, false, false, true);
        checkString(password, 'password', false, 6);

        /* get the user database info */
        const userCollection = await usersDb();

        /* query the database for the username */
        let hasUsername = await userCollection.findOne({ email: username.toLowerCase() });
        if (hasUsername == undefined || hasUsername == null) throw `Either the username or password is invalid`;

        /* username was found, check password */
        const user = hasUsername;
        let compare = false;
        try {
            compare = await bcrypt.compare(password, user.hashed_password);
        } catch (e) {
            throw e;
        }

        /* passwords match! */
        if (compare) {
            return { authenticated: true, data: user };
        }
        /* passwords do not match */
        else {
            throw `Either the username or password is invalid`;
        }
    } catch (e) {
        throw e;
    }
}

/*
 * Gets a user from the database given their username (screen_name)
 */
async function getUser(username) {
    try {
        checkAdvancedString(username, 'Screen Name', 6);
        const userCollection = await usersDb();
        const foundUser = await userCollection.findOne({ screen_name: username });
        if (!(foundUser != undefined && foundUser != null)) {
            throw "Error: User with username " + user + " was not found in the database!";
        }
        return foundUser;
    } catch (e) {
        throw e;
    }
}

/*
 * Gets a user from the database by their id
 */
async function getUserById(userId) {
    try {
        const userCollection = await usersDb();
        if (userId == undefined || userId.toString().trim() == '' || !ObjectId.isValid(userId.trim)) {
            throw "Error: Expected id to be a non-empty valid ObjectId.";
        }
        const foundUser = await userCollection.findOne({ _id: ObjectId(userId.toString()) });
        if (!(foundUser != undefined && foundUser != null)) {
            throw "Error: User with id " + userId + " was not found in the database!";
        }
        return foundUser;
    } catch (e) {
        throw e;
    }
}

module.exports = {
    createUser,
    checkUser,
    checkString,
    editUser,
    getUser,
    getUserById
}