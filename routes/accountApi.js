const express = require('express');
const router = express.Router();
const data = require('../data');
const accountFunctions = data.accountData;

router
    .route('/create')
    .get(async(req, res) => {
        return res.status(200).render('individualPages/createAccount');
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

module.exports = router;