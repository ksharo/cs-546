const express = require('express');
const router = express.Router();

router
    .route('/')
    .get(async(req, res) => {
        res.status(200).render('individualPages/homepage', { user: req.session.user, partial: 'mainScript' });
    });



module.exports = router;