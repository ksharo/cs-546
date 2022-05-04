const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const data = require('../data');
const reviewFunctions = data.reviewData;

router
    .route('/create')
    .post(async(req, res) => {
        try {
            if (req.session.user) {
                /* gathering and error checking of parameters */
                const content = req.body.review;
                const show = req.body.show;
                const anonymous = req.body.anon;
                if (content == undefined || content.trim() == '') {
                    return res.status(400).json({ error: 'Error: Please add content to your review.' })
                }
                if (show == undefined || show.trim() == '') {
                    return res.status(400).json({ error: 'Error: Please state which show the review belongs to.' })
                }
                if (show == undefined || show.trim() == '') {
                    return res.status(400).json({ error: 'Error: Please state which show the review belongs to.' })
                }
                if (anonymous == undefined || (anonymous != true && anonymous != false)) {
                    return res.status(400).json({ error: 'Error: Please note whether the review is anonymous or not.' })
                }
                /* get the username of the poster (current logged in user) */
                let poster = "";
                if (req.session.user.username) {
                    poster = req.session.user.username;
                } else {
                    return res.status(403).json({ error: 'Error: User must be logged in to leave a review' });
                }
                /* add the review to the database */
                const insert = await reviewFunctions.add(poster, anonymous, show.trim(), content.trim());
                if (insert.reviewInserted) {
                    return res.redirect(200, 'http://localhost:3000/shows/view' + show);
                } else {
                    return res.status(500).json({ error: 'Error: there was a problem adding your review. Please try again later.' });
                }
            } else {
                return res.status(403).json({ error: 'Error: User must be logged in to leave a review' });
            }
        } catch (e) {
            return res.status(500).json({ error: e.toString() })
        }
    });

router
    .route('/update')
    .patch(async(req, res) => {
        try {
            /* gather parameters and error check them */
            const content = req.body.review;
            const id = req.body.id;
            const anon = req.body.anonymous;
            if (content == undefined || content.trim() == '') {
                return res.status(400).json({ error: 'Error: Please add content to your review.' })
            }
            if (id == undefined || id.trim() == '' || !ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Error: Please provide a valid review id to update.' })
            }
            if (anon == undefined || (anon != true && anon != false)) {
                return res.status(400).json({ error: 'Error: Please note whether the review is anonymous or not.' })
            }
            /* send updated content to database */
            const updated = await reviewFunctions.update(id.trim(), anon, content.trim());
            if (updated.reviewUpdated) {
                return res.status(200).json({});
            } else {
                return res.status(500).json({ error: 'Error: could not update review. Please try again later.' });
            }
        } catch (e) {
            return res.status(500).json({ error: e.toString() })
        }
    });

router
    .route('/delete/:reviewId')
    .delete(async(req, res) => {
        try {
            /* gather parameters and error check */
            const reviewId = req.params.reviewId;
            if (reviewId == undefined || reviewId.trim() == '' || !ObjectId.isValid(reviewId)) {
                return res.status(400).json({ error: 'Error: Please provide a valid review id to delete.' })
            }
            const deleted = await reviewFunctions.deleteReview(reviewId);
            if (deleted.deleted) {
                return res.status(200).json({});
            } else {
                return res.status(500).json({ error: 'Error: could not delete review. Please try again later.' });
            }
        } catch (e) {
            return res.status(500).json({ error: e.toString() })
        }
    });
module.exports = router;