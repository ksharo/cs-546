const { isBoolean, isString } = require('lodash');
const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const { getUser } = require('./accountData');
const reviewsDB = mongoCollections.reviews;


/*
 * Adds a review with the given data to the database
 */
async function add(poster, anonymous, show_id, content) {
    try {
        /* error checking on all inputs */
        if (poster == undefined) throw 'Error: poster is a required parameter, but was not received.';
        if (anonymous == undefined) throw 'Error: anonymous is a required parameter, but was not received.';
        if (show_id == undefined) throw 'Error: show_id is a required parameter, but was not received.';
        if (content == undefined) throw 'Error: content is a required parameter, but was not received.';
        if (!isString(poster) || poster.trim() == '') throw `Error: Expected poster username to be non-empty string but received ${typeof(poster)} instead.`;
        if (!isBoolean(anonymous)) throw `Error: Expected anonymous to be boolean but received ${typeof(anonymous)} instead.`;
        if (!(show_id && show_id.trim() != '' && ObjectId.isValid(show_id))) throw `Error: Show ID must be a valid, non-empty ObjectId!`;
        if (!isString(content) || content.trim() == '') throw `Error: Expected content to be non-empty string but received ${typeof(content)} instead.`;
        let anon = anonymous;
        const user = await getUser(poster);
        const poster_id = user._id;
        const reviewCollection = await reviewsDB();
        try {
            const review = {
                poster_id: poster_id,
                time_posted: new Date(),
                show_id: show_id,
                content: content,
                anonymous: anon
            }
            const inserted = await reviewCollection.insertOne(review);
            if (!inserted.acknowledged || !inserted.insertedId) {
                throw `Error: Failed to add review!`;
            }
            return { reviewInserted: true, reviewData: { _id: inserted.insertedId, review } };
        } catch (e) {
            throw e;
        }
    } catch (e) {
        throw e;
    }
}

/*
 * Gets all the reviews for the show with the given id
 */
async function getByShow(show_id) {
    try {
        if (!(show_id && show_id.trim() != '' && ObjectId.isValid(show_id))) throw `Error: Show ID must be a valid, non-empty ObjectId!`;
        const reviewCollection = await reviewsDB();
        const foundReviews = await reviewCollection.find({ show_id: show_id }).sort({ time_posted: -1 }).toArray();
        if (!(foundReviews != undefined && foundReviews != null)) {
            throw "Error: Show with show id " + show_id + " was not found in the database!";
        }
        return foundReviews;
    } catch (e) {
        throw e;
    }
}

/* 
 * Gets all the reviews for the user with the given username.
 */
async function getByUser(username) {
    try {
        if (username == undefined || !isString(username) || username.trim() == '') throw `Error: Expected username to be non-empty string but received ${typeof(username)} instead.`;
        const reviewCollection = await reviewsDB();
        const user = await getUser(username);
        const poster_id = user._id;
        const foundReviews = await reviewCollection.find({ poster_id: poster_id }).sort({ time_posted: -1 }).toArray();
        if (!(foundReviews != undefined && foundReviews != null)) {
            throw "Error: Reviews for user " + username + " were not found in the database!";
        }
        return foundReviews;
    } catch (e) {
        throw e;
    }
}

/*
 * Updates the review with review_id to change the content or anonymity
 */
async function update(review_id, anonymous, content) {
    try {
        if (!(review_id && review_id.trim() != '' && ObjectId.isValid(review_id))) throw `Error: Review ID must be a valid, non-empty ObjectId!`;
        if (anonymous == undefined || !isBoolean(anonymous)) throw `Error: Expected anonymous to be boolean but received ${typeof(anonymous)} instead.`;
        if (content == undefined || !isString(content) || content.trim() == '') throw `Error: Expected content to be non-empty string but received ${typeof(content)} instead.`;

        /* get the original review for updating */
        const reviewCollection = await reviewsDB();
        const original = await reviewCollection.findOne({ _id: ObjectId(review_id.toString()) });
        if (original == null) {
            throw `Failed to fetch review for update.`;
        }

        /* create the updated review schema */
        const review = {
            poster_id: original['poster_id'],
            time_posted: new Date(),
            show_id: original['show_id'],
            content: content,
            anonymous: anonymous
        }

        /* execute the update */
        const updated = await reviewCollection.updateOne({ _id: ObjectId(review_id.toString()) }, { $set: review });
        if (updated.matchedCount == 0 || updated.modifiedCount == 0) {
            throw `Failed to update review.`;
        }

        /* get the review to return the data */
        const result = await reviewCollection.findOne({ _id: ObjectId(review_id.toString()) });
        if (result == null || result == undefined) {
            throw `Failed to fetch review after update.`;
        }
        return { reviewUpdated: true, data: result };
    } catch (e) {
        throw e;
    }
}

/*
 * deletes the review with review_id from the database
 */
async function deleteReview(review_id) {
    try {
        if (!(review_id && review_id.trim() != '' && ObjectId.isValid(review_id))) throw `Error: Review ID must be a valid, non-empty ObjectId!`;
        const reviewCollection = await reviewsDB();
        const deleted = await reviewCollection.deleteOne({ _id: ObjectId(review_id.toString()) });
        if (!deleted.acknowledged || deleted.deletedCount == 0) {
            throw `Error trying to delete review with id ${review_id}`;
        }
        return { deleted: true };
    } catch (e) {
        throw e;
    }

}


module.exports = {
    add,
    getByShow,
    getByUser,
    update,
    deleteReview
}