const express = require('express');
const router = express.Router();
const data = require('../data');

router
    .route('/')
    .get(async(req, res) => {
        try {
            const { likedShows, watchedShows } = await data.showData.getPopular();
            res.status(200).render('individualPages/homepage', { user: req.session.user, likedShows: likedShows, watchedShows: watchedShows, partial: 'mainScript' });
        } catch (e) {
            return res.status(500).render('individualPages/errorPage', { user: req.session.user, error: e.toString(), partial: 'mainScript' });
        }
    });

router
    .route('/offline')
    .get(async(req, res) => {
        return res.status(500).render('individualPages/offline', { user: req.session.user, partial: 'mainScript' });
    });



module.exports = router;