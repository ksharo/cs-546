const express = require('express');
const router = express.Router();
const data = require('../data');
const accountFunctions = data.accountData;
const globalFunctions = data.globalData;
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
    },
    {
        link: 'https://images.unsplash.com/photo-1612855190135-bdbacda2a2b5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        alt: 'bubbles'
    },
    {
        link: 'https://images.unsplash.com/photo-1573091465730-0b2c8befcfa6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        alt: 'a small snowman'
    },
    {
        link: 'https://images.unsplash.com/photo-1497752531616-c3afd9760a11?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        alt: 'a raccoon'
    },
    {
        link: 'https://images.unsplash.com/photo-1579380656108-f98e4df8ea62?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
        alt: 'a frog'
    },
    {
        link: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
        alt: 'a white bunny'
    },
    {
        link: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=394&q=80',
        alt: 'a happy chihuaua'
    },
    {
        link: 'https://images.unsplash.com/photo-1507666405895-422eee7d517f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        alt: 'a squirrel eating a nut'
    },
    {
        link: 'https://images.unsplash.com/photo-1590691565921-287ded4c80ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
        alt: 'a baby monkey'
    },
    {
        link: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
        alt: 'a majestic lion'
    },
    {
        link: 'https://images.unsplash.com/photo-1540968221243-29f5d70540bf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80',
        alt: 'a flying jellyfish'
    },
    {
        link: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
        alt: 'a pineapple'
    },
    {
        link: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=415&q=80',
        alt: 'a strawberry'
    },
    {
        link: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=415&q=80',
        alt: 'a half-peeled banana'
    },
    {
        link: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        alt: 'two cherries'
    },
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
            globalFunctions.checkAdvancedString(firstName, 'First Name', 1);
            globalFunctions.checkAdvancedString(lastName, 'Last Name', 1);
            globalFunctions.checkAdvancedString(email, 'Email', 6, false, false, true);
            globalFunctions.checkAdvancedString(username, 'Screen Name', 6);
            globalFunctions.checkAdvancedString(password, 'Password', 6, false, false, false);
            globalFunctions.checkAdvancedString(confirmation, 'Password Confirmation', 0, false, false, false);
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
                    initials: auth.data.first_name[0] + auth.data.last_name[0],
                    likes: auth.data.liked_shows,
                    dislikes: auth.data.disliked_shows,
                    watches: auth.data.watched_shows
                };
                return res.status(200).redirect('/shows/search');
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
            globalFunctions.checkAdvancedString(firstName, 'First Name', 1);
            globalFunctions.checkAdvancedString(lastName, 'Last Name', 1);
            globalFunctions.checkAdvancedString(username, 'Screen Name', 6);

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
                    initials: auth.data.first_name[0] + auth.data.last_name[0],
                    likes: auth.data.liked_shows,
                    dislikes: auth.data.disliked_shows,
                    watches: auth.data.watched_shows
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
        if (req.session.user) {
            try {
                const user = await accountFunctions.getUser(req.session['user']['username']);
                let recs = []
                try {
                    recs = await data.showData.getRecommendations(req.session['user']['username']);
                } catch (e) {
                    throw (e);
                }
                let reviews = await data.reviewData.getByUser(req.session['user']['username']);
                for (let i = 0; i < reviews.length; i++) {
                    try {
                        let show = await data.showData.getShow(reviews[i]['show_id']);
                        reviews[i]['showName'] = show;
                    } catch (e) {
                        throw (e);
                    }
                }
                //get user's reviews
                let likes = []
                for (let i = 0; i < user['liked_shows'].length; i++) {
                    try {
                        let show = await data.showData.getShow(user['liked_shows'][i]);
                        likes.push(show);
                    } catch (e) {
                        throw (e);
                    }
                }
                let seen = []
                for (let i = 0; i < user['watched_shows'].length; i++) {
                    try {
                        let show = await data.showData.getShow(user['watched_shows'][i]);
                        seen.push(show);
                    } catch (e) {
                        throw (e);
                    }
                }
                //maybe only show a maximum of 5 liked shows/watched shows/etc
                return res.status(200).render('individualPages/viewAccount', { user: req.session.user, likes: likes, watched: seen, recs: recs, reviews: reviews, partial: 'viewAccountScript' });
            } catch (e) {
                return res.status(500).json({ error: e.toString() });
            }
        } else {
            /* should be caught by middleware, but just in case...*/
            return res.status(403).redirect('/');
        }
    });

router
    .route('/view/:username')
    .get(async(req, res) => {
        try {
            const username = req.params.username;
            if (username.trim() == '') throw `Error: expected username to be non-empty string.`;
            const otherUser = await accountFunctions.getUser(username);
            let recs = []
            try {
                recs = await data.showData.getRecommendations(username);
            } catch (e) {
                throw (e);
            }
            let reviews = await data.reviewData.getByUser(username);
            for (let i = 0; i < reviews.length; i++) {
                try {
                    let show = await data.showData.getShow(reviews[i]['show_id']);
                    reviews[i]['showName'] = show;
                } catch (e) {
                    throw (e);
                }
            }
            let likes = []
            for (let i = 0; i < otherUser['liked_shows'].length; i++) {
                try {
                    let show = await data.showData.getShow(otherUser['liked_shows'][i]);
                    likes.push(show);
                } catch (e) {
                    throw (e);
                }
            }
            let seen = []
            for (let i = 0; i < otherUser['watched_shows'].length; i++) {
                try {
                    let show = await data.showData.getShow(otherUser['watched_shows'][i]);
                    seen.push(show);
                } catch (e) {
                    throw (e);
                }
            }
            //maybe only show a maximum of 5 liked shows/watched shows/etc
            return res.status(200).render('individualPages/viewAnotherAccount', { user: req.session.user, otherUser: otherUser, likes: likes, watched: seen, recs: recs, reviews: reviews, partial: 'viewAccountScript' });
        } catch (e) {
            return res.status(500).json({ error: e.toString() });
        }
    });

router
    .route('/login')
    .post(async(req, res) => {
        try {
            const username = req.body.username;
            const password = req.body.password;
            globalFunctions.checkAdvancedString(username, 'Username', 6, false, false, true);
            globalFunctions.checkAdvancedString(password, 'Password', 6, false, false, false);
            const auth = await accountFunctions.checkUser(username.trim(), password.trim());
            if (auth.authenticated) {
                /* set cookie for user */
                req.session.user = {
                    firstName: auth.data.first_name,
                    lastName: auth.data.last_name,
                    email: auth.data.email,
                    username: auth.data.screen_name,
                    img: auth.data.profile_pic,
                    initials: auth.data.first_name[0] + auth.data.last_name[0],
                    likes: auth.data.liked_shows,
                    dislikes: auth.data.disliked_shows,
                    watches: auth.data.watched_shows
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


module.exports = router;