const express = require('express');
const router = express.Router();
const data = require('../data');

router
    .route('/search')
    .get(async(req, res) => {
        // TODO make this route
        return res.status(200).render('individualPages/mainSearch', { user: req.session.user, partial: 'searchScript' });
    });

router
    .route('/add/:searchTerm')
    .get(async(req, res) => {
        try {
            // this route should be used when a user cannot find a show in our database
            const searchTerm = req.params.searchTerm;
            if (searchTerm && searchTerm.trim() != '') {
                const shows = await data.showData.searchMaze(searchTerm);
                for (let x of shows) {
                    x.show.image = x.show.image == null ? '/public/assets/no_image.jpeg' : x.show.image.medium ? x.show.image.medium : '/public/assets/no_image.jpeg'
                }
                return res.status(200).render('individualPages/addShow', { user: req.session.user, shows: shows, partial: 'addShowScript' });
            } else {
                // TODO show error on page
                return res.status(400).json({ error: 'please enter a search term' })
            }
        } catch (e) {
            // TODO show error on page
            return res.status(500).json({ error: e })
        }
    });

router
    .route('/add/:showId')
    .post(async(req, res) => {
        try {
            // this route should be used to add a tvmaze api show to our database
            const showId = req.params.showId;
            if (showId && showId.trim() != '') {
                const show = await data.showData.add(showId);
                if (show.showInserted) {
                    return res.status(200).json({ user: req.session.user, show: show.showData, partial: 'addShowScript' });
                } else {
                    // TODO show error on page
                }
            } else {
                // TODO show error on page
            }
        } catch (e) {
            // TODO show error on page
            return res.status(500).json({ error: e })
        }
    });

router
    .route('/view/:showId')
    .get(async(req, res) => {
        try {
            // this route should be used to get show data from our database and display that to the user
            const showId = req.params.showId;
            if (showId && showId.trim() != '') {
                const show = await data.showData.getShow(showId);
                return res.status(200).render('individualPages/viewShow', { user: req.session.user, showData: show, partial: 'viewShowScript' });
            }
        } catch (e) {
            // TODO show error on page
            return res.status(500).json({ error: e })
        }
    });

module.exports = router;