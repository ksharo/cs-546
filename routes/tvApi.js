const express = require('express');
const router = express.Router();
const data = require('../data');
const { ObjectId } = require('mongodb');

router
    .route('/search')
    .get(async(req, res) => {
        return res.status(200).render('individualPages/mainSearch', { user: req.session.user, partial: 'searchScript' });
    });

router
    .route('/search')
    .post(async(req, res) => {
        // TODO make this route
        try {
            const searchTerm = req.body.searchTerm;
            if (searchTerm && searchTerm.trim() != '') {
                const shows = await data.showData.searchDb(searchTerm);
                return res.status(200).render('individualPages/searchShow', { user: req.session.user, searchTerm: searchTerm, shows: shows, partial: 'searchScript' });
            } else {
                return res.status(400).json({ error: 'please enter a search term' })
            }
        } catch (e) {
            return res.status(500).json({ error: e })
        }
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
                return res.status(400).json({ error: 'Error: Please enter a non-empty search term.' })
            }
        } catch (e) {
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
                    return res.status(500).json({ error: 'Error: Could not add show with id ' + showId + ' from TV Maze to What2Watch Database.' });
                }
            } else {
                return res.status(400).json({ error: 'Error: Expected showId to be non-empty.' });
            }
        } catch (e) {
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
                let likeIcon = '/public/assets/tup_outline.svg';
                let dislikeIcon = '/public/assets/tdown_outline.svg';
                let watchedIcon = '/public/assets/check_outline.svg';

                /* send whether the user does or does not like/dislike/watch the show for icon fill/outline */
                if (req.session.user) {
                    if (req.session.user.likes.includes(showId)) {
                        likeIcon = '/public/assets/tup_filled.svg';
                    }
                    if (req.session.user.dislikes.includes(showId)) {
                        dislikeIcon = '/public/assets/tdown_filled.svg';
                    }
                    if (req.session.user.watches.includes(showId)) {
                        watchedIcon = '/public/assets/check_filled.svg';
                    }
                }
                return res.status(200).render('individualPages/viewShow', { user: req.session.user, showData: show, likeIcon: likeIcon, dislikeIcon: dislikeIcon, watchedIcon: watchedIcon, partial: 'viewShowScript' });
            }
        } catch (e) {
            return res.status(500).json({ error: e })
        }
    });

router
    .route('/addManual')
    .post(async(req, res) => {
        try {
            // this route should be used to create a new show with manual data added by the user
            // TODO: check for errors
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
                return res.status(500).json({ error: 'Error: could not insert manual show' })

            }
        } catch (e) {
            return res.status(500).json({ error: e })
        }
    });


router
    .route('/updateShowCounts/:showId')
    .patch(async(req, res) => {
        /* This route should be used for updating the likes/dislikes/watched counts of a show */
        try {
            const id = req.params.showId;
            const likes = req.body.likes;
            const dislikes = req.body.dislikes;
            const watches = req.body.watches;
            if (!req.session.user) {
                return res.status(400).json({ error: `Error: User is not logged in!` });
            }
            const user = req.session.user.username;
            /* check that username exists */
            if (!user) {
                return res.status(500).json({ error: `Error getting username` });
            }
            /* check that id is a valid ObjectId */
            if (!(id && id.trim() != '' && ObjectId.isValid(id))) {
                return res.status(400).json({ error: `Error: the show's id must be a valid ObjectId.` });
            }
            /* check that likes, dislikes, and watches are -1, 0, or 1 */
            try {
                data.showData.checkInt(likes);
                data.showData.checkInt(dislikes);
                data.showData.checkInt(watches);
                if (Number(likes) == 0 && Number(dislikes) == 0 && Number(watches) == 0) {
                    return res.status(500).json({ error: 'Error: No data to update!' });
                }
            } catch (e) {
                return res.status(400).json({ error: e });
            }
            const updated = await data.showData.updateCounts(id, user, likes, dislikes, watches);
            if (updated.showUpdated && updated.userUpdated) {
                /* success! */
                /* update req.session.user with likes/dislikes/watches */
                req.session.user.likes = updated.data.liked_shows;
                req.session.user.dislikes = updated.data.disliked_shows;
                req.session.user.watches = updated.data.watched_shows;
                return res.status(200).json({ success: true });
            } else {
                return res.status(500).json({ error: 'Error trying to update show counts' });
            }
        } catch (e) {
            return res.status(500).json({ error: e });
        }
    });

module.exports = router;