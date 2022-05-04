const express = require('express');
const router = express.Router();
const data = require('../data');

router
    .route('/')
    .get(async(req, res) => {
        // TODO add error checking
        try {
            const { likedShows, watchedShows } = await data.showData.getPopular();
            res.status(200).render('individualPages/homepage', { user: req.session.user, likedShows: likedShows, watchedShows: watchedShows, partial: 'mainScript' });
        } catch (e) {
            return res.status(500).json({ error: e.toString() });
        }
    });



module.exports = router;