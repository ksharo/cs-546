const express = require('express');
const router = express.Router();
const data = require('../data');
const reviewFunctions = data.reviewData;

router
    .route('/create')
    .post(async(req, res) => {
        try {
            let content = req.body.review;
            let show = req.body.show;
            const anonymous = req.body.anon;
            if (content && content.trim() != '' || show && show.trim() != '') {
                let poster = "";
                if (req.session.user) {
                    poster = req.session.user.username;
                }
                const insert = await reviewFunctions.add(poster, anonymous, show, content)
                return res.redirect(200, 'http://localhost:3000/shows/view' + show);
            } else {
                return res.status(400).json({ error: 'Please enter a review' })
            }
        } catch (e) {
            return res.status(500).json({ error: e.toString() })
        }
    });
router
    .route('/update')
    .post(async(req, res) => {
        try {
            let content = req.body.review;
            let id = req.body.id;
            const update = await reviewFunctions.update(id, content);
            return;
        } catch (e) {
            return res.status(500).json({ error: e.toString() })
        }
    });
module.exports = router;