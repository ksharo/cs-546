const express = require('express');
const router = express.Router();
const data = require('../data');

router
    .route('/')
    .get(async(req, res) => {
        res.status(200).render('individualPages/homepage');
    });

module.exports = router;