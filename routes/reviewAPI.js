const express = require('express');
const router = express.Router();
const data = require('../data');
const reviewFunctions = data.reviewData;

router
    .route('/create')
    .post(async(req, res) => {
        try{
            let content = req.body.review;
            let show = req.body.show;
            if (content && content.trim() != '' || show && show.trim() != '') {
                //somehow get poster id or if they are not logged in default to none
                let poster = ""
                const insert = await reviewFunctions.add(poster, show, content)
                return res.redirect(200, 'http://localhost:3000/shows/view'+show);
            } else {
                return res.status(400).json({ error: 'please enter a review' })
            }
        }catch(e){
            return res.status(500).json({ error: e })
        }
    });
module.exports = router;