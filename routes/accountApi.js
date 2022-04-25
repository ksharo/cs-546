const express = require('express');
const router = express.Router();
const data = require('../data');
const accountFunctions = data.accountData;
const validator = require('validator');

router
    .route('/create')
    .get(async(req, res) => {
        return res.status(200).render('individualPages/createAccount');
    });

router
    .route('/create')
    .post(async(req, res) => {
        try {
            /* get all inputs */
            const firstName = req.body.newFirstName.trim();
            const lastName = req.body.newLastName.trim();
            const email = req.body.newEmail.trim();
            const username = req.body.newScreenName.trim();
            const password = req.body.newPassword.trim();
            const confirmation = req.body.confirmNewPassword.trim();
            /* error check all inputs */
            checkString(firstName, 'First Name', 1);
            checkString(lastName, 'Last Name', 1);
            checkString(email, 'Email', 0, false, false, true);
            checkString(username, 'Screen Name', 6);
            checkString(password, 'Password', 6, false, false, false);
            checkString(confirmation, 'Password Confirmation', 0, false, false, false);
            if (password != confirmation) {
                throw `Error: Passwords don't match.`;
            }
            /* try to create the user */
            const auth = await accountFunctions.createUser(firstName, lastName, email, username, password);
            if (auth.userInserted) {
                /* if it works, go to search page */
                return res.status(200).redirect('/showSearch');
            } else {
                /* if it doesn't, show an error */
                return res.status(500).render('individualPages/createAccount', { error: true, errorStatus: 500, errorMessage: 'There was a problem creating your account. Please try again later.', firstName: firstName, lastName: lastName, email: email, username: username });
            }
        } catch (e) {
            const firstName = req.body.newFirstName.trim();
            const lastName = req.body.newLastName.trim();
            const email = req.body.newEmail.trim();
            const username = req.body.newScreenName.trim();
            /* if something went wrong, like an input was probably wrong, show an error */
            return res.status(400).render('individualPages/createAccount', { error: true, errorStatus: 400, errorMessage: e, firstName: firstName, lastName: lastName, email: email, username: username });
        }
    });

router
    .route('/login')
    .post(async(req, res) => {
        try {
            const auth = await accountFunctions.checkUser(req.body.username, req.body.password);
            if (auth.authenticated) {
                return res.status(200).json({ status: 200 });
            } else {
                return res.status(400).json({ status: 400, errorStatus: 400, errorMessage: 'Either the username or password is invalid' });
            }
        } catch (e) {
            return res.status(400).json({ status: 400, errorStatus: 400, errorMessage: e });
        }
    });

function checkString(str, name = 'Input', minLength = 1, onlyAlphNum = true, spacesAllowed = false, email = false) {
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
module.exports = router;