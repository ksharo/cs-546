const express = require('express');
const router = express.Router();
const data = require('../data');

router
    .route('/')
    .get(async(req, res) => {
        res.status(200).render('individualPages/homepage');
    });

router
    .route('/showSearch')
    .get(async(req, res) => {
        res.status(200).render('individualPages/mainSearch');
    });

module.exports = router;