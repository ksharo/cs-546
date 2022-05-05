const express = require('express');
const router = express.Router();
const data = require('../data');
const { ObjectId } = require('mongodb');
const { checkAdvancedString } = require('../data/globalData');

router
    .route('/search')
    .get(async(req, res) => {
        return res.status(200).render('individualPages/mainSearch', { user: req.session.user, partial: 'searchScript' });
    });

router
    .route('/allShows')
    .get(async(req, res) => {
        try {
            const shows = await data.showData.getAll();
            return res.status(200).render('individualPages/allShows', { user: req.session.user, shows: shows, partial: 'allShowScript' });
        } catch (e) {
            return res.status(500).json({ error: e.toString() });
        }
    });


router
    .route('/search')
    .post(async(req, res) => {
        try {
            const searchTerm = req.body.searchTerm;
            if (searchTerm && searchTerm.trim() != '') {
                const shows = await data.showData.searchDb(searchTerm);
                return res.status(200).render('individualPages/searchShow', { user: req.session.user, searchTerm: searchTerm, shows: shows, partial: 'searchScript' });
            } else {
                return res.status(400).json({ error: 'Error: Please enter a search term' })
            }
        } catch (e) {
            return res.status(500).json({ error: e.toString() })
        }
    });

router
    .route('/search/:searchTerm')
    .get(async(req, res) => {
        try {
            const searchTerm = req.params.searchTerm;
            if (searchTerm && searchTerm.trim() != '') {
                const shows = await data.showData.searchDb(searchTerm);
                return res.status(200).render('individualPages/searchShow', { user: req.session.user, searchTerm: searchTerm, shows: shows, partial: 'searchScript' });
            } else {
                return res.status(400).json({ error: 'Error: Please enter a search term' })
            }
        } catch (e) {
            return res.status(500).json({ error: e.toString() })
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
                    /* prepare required data for user to view */
                    x.show.image = x.show.image == null ? '/public/assets/no_image.jpeg' : x.show.image.medium ? x.show.image.medium : '/public/assets/no_image.jpeg';
                    x.show.start_year = x.show.premiered ? (x.show.premiered.split('-').length > 0 ? x.show.premiered.split('-')[0] : 'N/A') : 'N/A';
                    x.show.end_year = x.show.ended ? (x.show.ended.split('-').length > 0 ? x.show.ended.split('-')[0] : 'Present') : 'Present';
                }
                return res.status(200).render('individualPages/addShow', { user: req.session.user, shows: shows, searchTerm: searchTerm, partial: 'addShowScript' });
            } else {
                return res.status(400).json({ error: 'Error: Please enter a non-empty search term.' })
            }
        } catch (e) {
            // since we handle offline on client side, this just means no shows were found!
            const searchTerm = req.params.searchTerm;
            return res.status(200).render('individualPages/addShow', { user: req.session.user, shows: [], searchTerm: searchTerm, partial: 'addShowScript' });
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
            return res.status(500).json({ error: e.toString() })
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
                const reviews = await data.reviewData.getByShow(showId);
                for (let x of reviews) {
                    /* prepare review data for the user to view */
                    if (!x.anonymous) {
                        const poster = await data.accountData.getUserById(x.poster_id);
                        x.prof_pic = poster.profile_pic == '' ? '/public/assets/empty_profile.svg' : poster.profile_pic;
                        x.reviewer = poster.screen_name;
                        x.link = 'http://localhost:3000/account/view/' + x.reviewer;
                    } else {
                        x.prof_pic = '/public/assets/empty_profile.svg';
                        x.reviewer = 'Anonymous';
                        x.link = 'http://localhost:3000/shows/view/' + showId;
                    }
                }
                return res.status(200).render('individualPages/viewShow', { user: req.session.user, showData: show, likeIcon: likeIcon, dislikeIcon: dislikeIcon, watchedIcon: watchedIcon, reviews: reviews, partial: 'viewShowScript' });
            }
        } catch (e) {
            return res.status(500).json({ error: e.toString() })
        }
    });

router
    .route('/addManual')
    .post(async(req, res) => {
        try {
            // this route should be used to create a new show with manual data added by the user
            const showName = req.body.name;
            const showImg = req.body.img; // not required
            const language = req.body.language; // not required
            const summary = req.body.summary;
            const startYear = req.body.start;
            const endYear = req.body.end; // not required
            const numEpisodes = req.body.numEpisodes; // not required
            const runtime = req.body.runtime; // not required
            const genres = req.body.genres;
            /* error check string parameters */
            checkAdvancedString(showName, 'Show Name', 1, false, true, false);
            /* image link not required */
            if (showImg != undefined && showImg.trim() != '') {
                checkAdvancedString(showImg, 'Show Image Link', 5, false, false, false);
            }
            /* language not required */
            if (language != undefined && language.trim() != '') {
                checkAdvancedString(language, 'Show Language', 2, true, true, false);
            }
            checkAdvancedString(summary, 'Show Summary', 20, false, true, false);
            if (summary.trim().length > 500) throw `Error: summary must be at most 500 characters.`;
            /* error check number parameters */
            data.showData.checkInt(Number(startYear), 1900, 2023, 'Start Year');
            /* take into account that the show might still be going! */
            if (endYear != undefined && endYear.trim() != '') {
                data.showData.checkInt(Number(endYear), 1900, 2023, 'End Year');
                if (Number(endYear) < Number(startYear)) {
                    return res.status(400).json({ error: "Error: End year must be later than start year" });
                }
            }
            /* number of episodes not required */
            if (numEpisodes != undefined && numEpisodes.trim() != '') {
                data.showData.checkInt(Number(numEpisodes), 0, undefined, 'Number of Episodes');
            }
            /* runtime not required */
            if (runtime != undefined && runtime.trim() != '') {
                data.showData.checkInt(Number(runtime), 0, undefined, 'Runtime');
            }

            /* error check and prepare array of genres */
            checkAdvancedString(genres, 'Genres', 1, false, true, false);
            const genreList = genres.trim().split(',');
            const show = await data.showData.addManual(showName, showImg, startYear, endYear, numEpisodes, language, runtime, summary, genreList);
            if (show.showInserted) {
                return res.status(200).json({ user: req.session.user, show: show.showData, partial: 'addShowScript' });
            } else {
                return res.status(500).json({ error: 'Error: could not insert manual show' })

            }
        } catch (e) {
            return res.status(400).json({ error: e.toString() })
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
                return res.status(400).json({ error: e.toString() });
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
            return res.status(500).json({ error: e.toString() });
        }
    });

module.exports = router;

/* TODO: 
 * Error checking
 * add filters and sorting to all shows page
 * a user that is not logged in cannot add shows
 * edit show's missing data?
 * edit password
 * edit/delete reviews - DONE
 * add checkbox functionality to update reviews - DONE
 * add top rated tv shows to home page - DONE
 * add reviews to seed file - DONE
 * make search results scrollable - DONE
 * all tv shows page - DONE
 * add reviews - DONE
 * show reviews - DONE
 * other user page - DONE
 * middleware for logins and permissions - DONE
 * show search term on search page and add page - DONE
 * add search bar to search page and add page - DONE
 * check view account page for prettiness - DONE
 * Extras:
 * 
 * 
 * backend
 * accountData.js has been error checked fully!
 * showData.js has been error checked fully!
 * reviewData.js has been error checked fully!
 * 
 * routes
 * accountApi.js has been error checked fully!
 * mainApi.js has been error checked fully!
 * reviewAPI.js has been error checked fully!
 * tvApi.js has been error checked fully!
 * 
 * scripts
 * addShowScript.js has been error checked fully!
 * viewAccountScript.js has been error checked fully!
 */