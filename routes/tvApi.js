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
                    x.show.image = x.show.image == null ? '/public/assets/no_image.jpeg' : x.show.image.medium ? x.show.image.medium : '/public/assets/no_image.jpeg';
                    x.show.start_year = x.show.premiered ? (x.show.premiered.split('-').length > 0 ? x.show.premiered.split('-')[0] : 'N/A') : 'N/A';
                    x.show.end_year = x.show.ended ? (x.show.ended.split('-').length > 0 ? x.show.ended.split('-')[0] : 'Present') : 'Present';
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

router
    .route('/addManual')
    .post(async(req, res) => {
        try {
            // this route should be used to create a new show with manual data added by the user
            const showName = req.body.name;
            const showImg = req.body.img;
            const startYear = req.body.start;
            const endYear = req.body.end;
            const language = req.body.language;
            const numEpisodes = req.body.numEpisodes;
            const runtime = req.body.runtime;
            const summary = req.body.summary;
            const genres = req.body.genres;
            const show = await data.showData.addManual(showName, showImg, startYear, endYear, numEpisodes, language, runtime, summary, [genres]);
            if (show.showInserted) {
                return res.status(200).json({ user: req.session.user, show: show.showData, partial: 'addShowScript' });
            } else {
                // TODO show error on page

            }
        } catch (e) {
            // TODO show error on page
            return res.status(500).json({ error: e })
        }
    });

module.exports = router;