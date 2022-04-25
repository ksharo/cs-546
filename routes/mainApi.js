const express = require('express');
const router = express.Router();
const data = require('../data');

router
    .route('/')
    .get(async(req, res) => {
        res.status(200).render('individualPages/homepage', { user: req.session.user });
    });

router
    .route('/showSearch')
    .get(async(req, res) => {
        res.status(200).render('individualPages/mainSearch', { user: req.session.user });
    });

module.exports = router;