const express = require('express');
const router = express.Router();
const data = require('../data');

router
    .route('/login')
    .get(async(req, res) => {
        res.status(200).render('individualPages/login');
    });


router
    .route('/create')
    .get(async(req, res) => {
        res.status(200).render('individualPages/createAccount');
    });

module.exports = router;