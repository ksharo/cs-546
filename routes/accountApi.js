const express = require('express');
const router = express.Router();
const data = require('../data');
const accountFunctions = data.accountData;
const validator = require('validator');

const imgData = [{
        link: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHVwcHl8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
        alt: 'a cute puppy'
    },
    {
        link: 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8a2l0dGVufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
        alt: 'a cute kitten'
    },
    {
        link: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YmlyZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
        alt: 'a sitting parrot'
    },
    {
        link: 'https://images.unsplash.com/photo-1605326152964-56fb991b95ff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80',
        alt: 'an elephant walking in the sunset'
    },
    {
        link: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YW5pbWFsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
        alt: 'an fox in a wintry wonderland'
    },
    {
        link: 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YW5pbWFsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
        alt: 'a white tiger'
    },
    {
        link: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8YW5pbWFsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
        alt: 'puppy in a sweater'
    },
    {
        link: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8YW5pbWFsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
        alt: 'a sea turtle'
    },
    {
        link: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGFuaW1hbHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
        alt: 'a hamster'
    },
    {
        link: 'https://images.unsplash.com/photo-1475809913362-28a064062ccd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGFuaW1hbHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
        alt: 'a butterfly'
    },
    {
        link: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGFuaW1hbHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
        alt: 'a goldfish'
    },
    {
        link: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjN8fGFuaW1hbHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
        alt: 'a silly giraffe'
    }

]

router
    .route('/create')
    .get(async(req, res) => {
        return res.status(200).render('individualPages/createAccount', { user: req.session.user, partial: 'createAccountScript' });
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
            checkString(email, 'Email', 6, false, false, true);
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
                req.session.user = {
                    firstName: auth.data.first_name,
                    lastName: auth.data.last_name,
                    email: auth.data.email,
                    username: auth.data.screen_name,
                    img: auth.data.profile_pic,
                    initials: auth.data.first_name[0] + auth.data.last_name[0]
                };
                return res.status(200).redirect('/showSearch');
            } else {
                /* if it doesn't, show an error */
                return res.status(500).json({ error: true, errorStatus: 500, errorMessage: 'There was a problem creating your account. Please try again later.' });
            }
        } catch (e) {
            /* if something went wrong, like an input was probably wrong, show an error */
            return res.status(400).json({ error: true, errorStatus: 400, errorMessage: e });
        }
    });

router
    .route('/edit')
    .get(async(req, res) => {
        return res.status(200).render('individualPages/editAccount', { user: req.session.user, imgData: imgData, partial: 'editAccountScript' });
    });

router
    .route('/edit')
    .patch(async(req, res) => {
        try {
            /* get all inputs */
            const firstName = req.body.editFirstName.trim();
            const lastName = req.body.editLastName.trim();
            const username = req.body.editScreenName.trim();
            const img = req.body.editImg.trim();
            /* if everything is the same as before, no need to continue */
            if (firstName == req.session.user.firstName && lastName == req.session.user.lastName && username == req.session.user.username && (img == req.session.user.img || img == 'null' || img == '' || img == null)) {
                return res.status(200).render('individualPages/editAccount', { user: req.session.user, imgData: imgData, partial: 'editAccountScript' });
            }
            /* error check all inputs */
            checkString(firstName, 'First Name', 1);
            checkString(lastName, 'Last Name', 1);
            checkString(username, 'Screen Name', 6);

            /* try to update the user (don't overwrite image with empty string!) */
            const auth = await accountFunctions.editUser(firstName, lastName, req.session.user.email, req.session.user.username, username, img == '' ? req.session.user.img : img);
            if (auth.userUpdated) {
                /* if it works, update the session variables */
                req.session.user = {
                    firstName: auth.data.first_name,
                    lastName: auth.data.last_name,
                    email: req.session.user.email,
                    username: auth.data.screen_name,
                    img: auth.data.profile_pic,
                    initials: auth.data.first_name[0] + auth.data.last_name[0]
                };
                return res.status(200).render('individualPages/editAccount', { user: req.session.user, imgData: imgData, partial: 'editAccountScript' });
            } else {
                /* if it doesn't, show an error */
                return res.status(500).json({ error: true, errorStatus: 500, errorMessage: 'There was a problem updating your account. Please try again later.' });
            }
        } catch (e) {
            /* if something went wrong, like an input was probably wrong, show an error */
            return res.status(400).json({ error: true, errorStatus: 400, errorMessage: e });
        }
    });

router
    .route('/view')
    .get(async(req, res) => {
        return res.status(200).render('individualPages/viewAccount', { user: req.session.user, partial: 'mainScript' });
    });


router
    .route('/login')
    .post(async(req, res) => {
        try {
            const username = req.body.username;
            const password = req.body.password;
            checkString(username, 'Username', 6, false, false, true);
            checkString(password, 'Password', 6, false, false, false);
            const auth = await accountFunctions.checkUser(username.trim(), password.trim());
            if (auth.authenticated) {
                /* set cookie for user */
                req.session.user = {
                    firstName: auth.data.first_name,
                    lastName: auth.data.last_name,
                    email: auth.data.email,
                    username: auth.data.screen_name,
                    img: auth.data.profile_pic,
                    initials: auth.data.first_name[0] + auth.data.last_name[0]
                };
                return res.status(200).json({ status: 200, user: req.session.user });
            } else {
                return res.status(400).json({ status: 400, errorStatus: 400, errorMessage: 'Either the username or password is invalid' });
            }
        } catch (e) {
            return res.status(400).json({ status: 400, errorStatus: 400, errorMessage: e });
        }
    });

router
    .route('/logout')
    .get(async(req, res) => {
        /* delete session (log out user) */
        req.session.cookie.expires = new Date(Date.now() - 10000);
        req.session.destroy();
        return res.redirect('/');
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