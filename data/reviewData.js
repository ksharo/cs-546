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

module.exports = {
    add,
    getByShow,
    getByUser
}