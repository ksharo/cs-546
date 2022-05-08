const mongoCollections = require('../config/mongoCollections');
const usersDb = mongoCollections.users;
const bcrypt = require('bcryptjs');
const saltRounds = 4;
const { ObjectId } = require('mongodb');
const { checkAdvancedString, checkString } = require('./globalData');


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

        const updated = await userCollection.updateOne({ email: email.toLowerCase() }, { $set: updatedUser });
        if (updated.matchedCount == 0 || updated.modifiedCount == 0) {
            throw `Failed to update account.`;
        }

        /* get the user to return the data */
        const result = await userCollection.findOne({ email: email.toLowerCase() });
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
        const foundUser = await userCollection.findOne({ screen_name: username.toLowerCase() });
        if (!(foundUser != undefined && foundUser != null)) {
            throw "Error: User with username " + username + " was not found in the database!";
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
        if (userId == undefined || userId.toString().trim() == '' || !ObjectId.isValid(userId.toString().trim())) {
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

/*
 * Checks to make sure the user is verified with their current password,
 * then updates their account to store their new password instead.
 */
async function changePassword(userEmail, curPass, newPassword) {
    try {
        /* make sure user is valid (this will also check userEmail and curPass for validation) */
        const valid = await checkUser(userEmail, curPass);
        if (valid.authenticated != true) {
            throw 'Error! Password is incorrect.';
        }
        if (curPass == newPassword) {
            /* if everything is the same as before, no need to update */
            return { userUpdated: true };
        }
        /* check that newPassword is valid */
        checkAdvancedString(newPassword, 'New Password', 6, false, false, false);
        /* update password in database to new password */
        /* hash the password */
        const hash = await bcrypt.hash(newPassword, saltRounds);
        /* update the  user in the database */
        const updatedUser = {
            hashed_password: hash,
        }
        const userCollection = await usersDb();
        const updated = await userCollection.updateOne({ email: userEmail.toLowerCase() }, { $set: updatedUser });
        if (updated.matchedCount == 0 || updated.modifiedCount == 0) {
            throw `Failed to update account.`;
        }
        return { userUpdated: true };
    } catch (e) {
        throw e;
    }

}

module.exports = {
    createUser,
    checkUser,
    editUser,
    getUser,
    getUserById,
    changePassword
}