const mongoCollections = require('../config/mongoCollections');
const showDb = mongoCollections.shows;
const userDb = mongoCollections.users;
const axios = require('axios');
const { ObjectId } = require('mongodb');

/*
 * This function searches for a tv show within our
 * shows database given the search term. It returns
 * the results of that search, or an empty array if nothing was found
 */
async function searchDb(searchTerm) {
    return [];
}

/*
 * This function searches for a tv show within the
 * TV Maze Api so that users can add shows to our database
 */
async function searchMaze(searchTerm) {
    try {
        const { data } = await axios.get('http://api.tvmaze.com/search/shows?q=' + searchTerm);
        // filter out shows that are already in the database
        const validShows = [];
        const showCollection = await showDb();
        for (let x of data) {
            let hasMazeId = await showCollection.findOne({ maze_id: x.show.id });
            if (!(hasMazeId != undefined && hasMazeId != null)) {
                validShows.push(x);
            }
        }
        return validShows;
    } catch {
        throw 'Error trying to get shows with search term: ' + searchTerm;
    }
}

/*
 * This function adds the tv show with the parameterized
 * tvMazeAPI id to our show database
 */
async function add(showId) {
    try {
        // get the show with the given id
        const { data } = await axios.get('http://api.tvmaze.com/shows/' + showId);
        // add the show to the database
        // make sure maze id doesn't already exist in database
        const showCollection = await showDb();
        const hasMazeId = await showCollection.findOne({ maze_id: showId });
        if (hasMazeId != undefined && hasMazeId != null) throw `Error: Show with maze id ${showId} already exists in the database!`;
        // TODO: check that all data exists
        // TODO: get number of episodes from somewhere or delete
        const newShow = {
            maze_id: data.id,
            name: dataValidation(data.name),
            likes: 0,
            dislikes: 0,
            watches: 0,
            image: data.image == null ? '/public/assets/no_image.jpeg' : (data.image.medium ? data.image.medium : '/public/assets/no_image.jpeg'),
            start_year: data.premiered ? (data.premiered.split('-').length > 0 ? data.premiered.split('-')[0] : 'N/A') : 'N/A',
            end_year: data.ended ? (data.ended.split('-').length > 0 ? data.ended.split('-')[0] : 'Present') : 'Present',
            num_episodes: 0,
            language: dataValidation(data.language),
            runtime: dataValidation(data.runtime),
            summary: dataValidation(data.summary),
            genres: data.genres ? data.genres : []
        }
        const inserted = await showCollection.insertOne(newShow);
        if (!inserted.acknowledged || !inserted.insertedId) {
            throw `Error: Failed to add show with tv maze id ${showId}`;
        }
        return { showInserted: true, showData: { _id: inserted.insertedId, newShow } };
    } catch (e) {
        throw e;
    }
}

/*
 * This function adds the tv show with the parameterized
 * manually-inputted information to our database
 */
async function addManual(name, image, start, end, numEpisodes, language, runtime, summary, genres) {
    try {
        const showCollection = await showDb();
        // TODO: check that all data exists
        const newShow = {
            maze_id: -1,
            name: dataValidation(name),
            likes: 0,
            dislikes: 0,
            watches: 0,
            image: image == null || image == undefined ? '/public/assets/no_image.jpeg' : image,
            start_year: dataValidation(start),
            end_year: end ? end : 'Present',
            num_episodes: dataValidation(numEpisodes),
            language: dataValidation(language),
            runtime: dataValidation(runtime),
            summary: dataValidation(summary),
            genres: genres ? genres : []
        }
        const inserted = await showCollection.insertOne(newShow);
        if (!inserted.acknowledged || !inserted.insertedId) {
            throw `Error: Failed to add show from manual data!`;
        }
        return { showInserted: true, showData: { _id: inserted.insertedId, newShow } };
    } catch (e) {
        throw e;
    }
}

/*
 * Helps with data validation of all of the tv shows
 */
const dataValidation = (string) => {
    if (string == null) {
        return 'N/A';
    }
    string = string.toString();
    if (string == undefined || string == null || string.trim() == '') {
        return 'N/A';
    } else {
        return string;
    }
};

/*
 * This function gets the tv show with the given id from our 
 * shows database.
 */
async function getShow(showId) {
    try {
        if (showId && showId.trim() != '' && ObjectId.isValid(showId)) {
            const showCollection = await showDb();
            const foundShow = await showCollection.findOne({ _id: ObjectId(showId) });
            if (!(foundShow != undefined && foundShow != null)) throw `Error: Show with id ${showId} was not found in the database!`;
            else {
                return foundShow;
            }
        } else {
            throw `Error: Show ID must be a valid, non-empty ObjectId!`;
        }
    } catch (e) {
        throw e;
    }
}

/*
 * This function is called when a user likes/dislikes or says they've watched a show.
 * It updates that show's counts accordingly and adds/removes that show from the list of user's
 * likes/dislikes/watched shows
 */
async function updateCounts(showId, username, likes, dislikes, watches) {
    try {
        /* TODO: error check */
        /* get the show database info */
        const showCollection = await showDb();
        const thisShow = await this.getShow(showId);
        /* update the show in the database */
        const updatedShow = {
            likes: Number(thisShow.likes) + Number(likes),
            dislikes: Number(thisShow.dislikes) + Number(dislikes),
            watches: Number(thisShow.watches) + Number(watches)
        }

        const updated = await showCollection.updateOne({ _id: ObjectId(showId) }, { $set: updatedShow });
        if (updated.matchedCount == 0 || updated.modifiedCount == 0) {
            throw `Failed to update show data.`;
        }
        /* get the user database info */
        const userCollection = await userDb();
        /* get the user */
        const user = await userCollection.findOne({ screen_name: username.toLowerCase() });
        if (user != null && user != undefined) {
            const newLikes = user.liked_shows;
            const newDislikes = user.disliked_shows;
            const newWatches = user.watched_shows;
            /* update the user in the database */
            if (user.liked_shows.includes(showId) && Number(likes) == -1) {
                /* remove the show from the user's likes */
                newLikes.remove(showId);
            }
            if (user.disliked_shows.includes(showId) && Number(dislikes) == -1) {
                /* remove the show from the user's dislikes */
                newDislikes.remove(showId);
            }
            if (user.watched_shows.includes(showId) && Number(watches) == -1) {
                /* remove the show from the user's watched-list */
                newWatches.remove(showId);
            }
            if (!user.liked_shows.includes(showId) && Number(likes) == 1) {
                /* add the show to the user's likes */
                newLikes.push(showId);
            }
            if (!user.disliked_shows.includes(showId) && Number(dislikes) == 1) {
                /* add the show to the user's dislikes */
                newDislikes.push(showId);
            }
            if (!user.watched_shows.includes(showId) && Number(watches) == 1) {
                /* add the show to the user's watched-list */
                newWatches.push(showId);
            }
            /* update the show in the database */
            const updatedUser = {
                liked_shows: newLikes,
                disliked_shows: newDislikes,
                watched_shows: newWatches
            }
            const updatedU = await userCollection.updateOne({ screen_name: username.toLowerCase() }, { $set: updatedUser });
            if (updatedU.matchedCount == 0 || updatedU.modifiedCount == 0) {
                throw `Failed to update user data.`;
            }
        } else {
            throw `Failed to find user with username ${username} in database!`
        }
        return { showUpdated: true, userUpdated: true };
    } catch (e) {
        throw e;
    }
}


module.exports = {
    searchDb,
    add,
    searchMaze,
    getShow,
    addManual,
    updateCounts
}