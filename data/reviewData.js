const { ObjectId } = require('bson');
const mongoCollections = require('../config/mongoCollections');
const reviewsDB = mongoCollections.reviews;

async function add(poster_id, show_id, content){
    let anon = true
    if(poster_id){
        anon = false;
    }
    const reviewCollection = await reviewsDB();
    try{
        const review = {
            poster_id:poster_id,
            time_posted:new Date(),
            show_id:show_id,
            content:content,
            anonymous:anon
        }
        const inserted = await reviewCollection.insertOne(review);
        if (!inserted.acknowledged || !inserted.insertedId) {
            throw `Error: Failed to add show with tv maze id ${showId}`;
        }
        return { reviewInserted: true, reviewData: { _id: inserted.insertedId, review } };
    }catch(e){
        throw e;
    }
}

async function getByShow(show_id){
    const reviewCollection = await reviewsDB();
    const foundReviews = await reviewCollection.find({ show_id: show_id }).toArray();
    if (!(foundReviews != undefined && foundReviews != null)) {
        throw "Error: Show with show id " + show_id + " was not found in the database!";
    }
    return foundReviews;
}

async function getByUser(username){
    const reviewCollection = await reviewsDB();
    const foundReviews = await reviewCollection.find({poster_id:username}).toArray();
    if (!(foundReviews != undefined && foundReviews != null)) {
        throw "Error: Show with show id " + show_id + " was not found in the database!";
    }
    return foundReviews;
}

async function update(id, content){
    try{
        const reviewCollection = await reviewsDB();
        const original = await reviewCollection.findOne({ _id: ObjectId(id) });
        if (original == null) {
            throw `Failed to fetch user after update.`;
        }
        const review = {
            poster_id:original['poster_id'],
            time_posted:new Date(),
            show_id:original['show_id'],
            content:content,
            anonymous:original['anon']
        }
        const updated = await reviewCollection.updateOne({_id:ObjectId(id)}, {$set: review});
        if (updated.matchedCount == 0 || updated.modifiedCount == 0) {
            throw `Failed to update account.`;
        }

        /* get the user to return the data */
        const result = await reviewCollection.findOne({ _id: ObjectId(id) });
        if (result == null || result == undefined) {
            throw `Failed to fetch user after update.`;
        }
        return { reviewUpdated: true, data: result };
    }catch(e){
        throw e;
    }
}

module.exports = {
    add,
    getByShow,
    getByUser,
    update
}