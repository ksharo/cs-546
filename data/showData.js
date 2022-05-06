const mongoCollections = require('../config/mongoCollections');
const showDb = mongoCollections.shows;
const userDb = mongoCollections.users;
const axios = require('axios');
const { ObjectId } = require('mongodb');
const { checkString } = require('./globalData');

/*
 * This function searches for a tv show within our
 * shows database given the search term. It returns
 * the results of that search, or an empty array if nothing was found
 */
async function searchDb(searchTerm) {
    // check search term for valid non-empty string
    if (searchTerm == undefined || searchTerm.trim() == '' || typeof(searchTerm) != 'string') {
        throw 'Error: Expected search term to be a non-empty string';
    }
    try {
        const validShows = [];
        const showCollection = await showDb();
        let matchingnames = await showCollection.find({ name: { $regex: searchTerm, $options: '-i' } }).toArray();
        for (x of matchingnames) {
            validShows.push(x)
        }
        let matchinggenres = await showCollection.find({ genres: { $regex: searchTerm, $options: '-i' } }).toArray();
        for (x of matchinggenres) {
            validShows.push(x)
        }
        let matchingsummary = await showCollection.find({ summary: { $regex: searchTerm, $options: '-i' } }).toArray();
        for (x of matchingsummary) {
            validShows.push(x)
        }
        /* Deleting possible collected duplicates */
        var elements = validShows.reduce(function(previous, current) {
            var object = previous.filter(object => object.name === current.name);
            if (object.length == 0) {
                previous.push(current);
            }
            return previous;
        }, []);
        return elements;
    } catch (e) {
        throw e;
    }
}

/* 
 * This function returns the 5 most liked and 5 most watched shows
 */
async function getPopular() {
    try {
        const showCollection = await showDb();
        const watchedShows = await showCollection.find({}).sort({ watches: -1 }).limit(5).toArray();
        const likedShows = await showCollection.find({}).sort({ likes: -1 }).limit(5).toArray();
        return { watchedShows: watchedShows, likedShows: likedShows };
    } catch (e) {
        throw e;
    }
}

/*
 * This function returns all shows in our database
 */
async function getAll() {
    try {
        const showCollection = await showDb();
        const showList = await showCollection.find({}).sort({ name: 1 }).toArray();
        if (!showList) throw 'Could not get shows';
        return showList;
    } catch (e) {
        throw e;
    }
}

/*
 * This function searches for a tv show within the
 * TV Maze Api so that users can add shows to our database
 */
async function searchMaze(searchTerm) {
    try {
        checkString(searchTerm, 'Search Term', false, 1);
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
    if (showId == undefined || Number(showId) < 0) throw 'Error: Expected showId to be a valid Maze show id!';
    try {
        /* get the show with the given id */
        const { data } = await axios.get('http://api.tvmaze.com/shows/' + showId);
        /* add the show to the database if maze id doesn't already exist in database */
        const showCollection = await showDb();
        const hasMazeId = await showCollection.findOne({ maze_id: showId });
        if (hasMazeId != undefined && hasMazeId != null) throw `Error: Show with maze id ${showId} already exists in the database!`;
        /* get number of episodes */
        const episodes = await axios.get('http://api.tvmaze.com/shows/' + showId + '/episodes');
        if (!episodes) throw `Error: could not get list of episodes for show with id ${showId}.`;
        const start = data.premiered ? (data.premiered.split('-').length > 0 ? data.premiered.split('-')[0] : '?') : '?';
        const end = data.ended ? (data.ended.split('-').length > 0 ? data.ended.split('-')[0] : start == '?' ? '?' : 'Present') : start == '?' ? '?' : 'Present';
        const newShow = {
            maze_id: data.id,
            name: dataValidation(data.name),
            likes: 0,
            dislikes: 0,
            watches: 0,
            image: data.image == null ? '/public/assets/no_image.jpeg' : (data.image.medium ? data.image.medium : '/public/assets/no_image.jpeg'),
            start_year: start ? start : '?',
            end_year: end ? end : start ? 'Present' : '?',
            num_episodes: dataValidation(episodes.data.length),
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
        const newShow = {
            maze_id: -1,
            name: dataValidation(name),
            likes: 0,
            dislikes: 0,
            watches: 0,
            image: image == null || image == undefined ? '/public/assets/no_image.jpeg' : image,
            start_year: start ? start : '?',
            end_year: end ? end : start ? 'Present' : '?',
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
        /* Error check all variables */
        /* make sure show id is a valid objectID */
        if (!(showId && showId.trim() != '' && ObjectId.isValid(showId))) throw `Error: showId must be a valid ObjectId.`;
        /* make sure username is a valid string */
        if (username == undefined || username == null || username.trim() == '') throw `Error: Username must be a nonempty string.`;
        /* make sure likes, dislikes, and watches all exist and are numbers in the range -1 to 1 */
        checkInt(likes, -1, 1, 'likes');
        checkInt(dislikes, -1, 1, 'dislikes');
        checkInt(watches, -1, 1, 'watches');
        /* get the show database info */
        const showCollection = await showDb();
        const thisShow = await this.getShow(showId);
        /* prepare to update the show in the database */
        const updatedShow = {
            likes: Number(thisShow.likes) + Number(likes),
            dislikes: Number(thisShow.dislikes) + Number(dislikes),
            watches: Number(thisShow.watches) + Number(watches)
        }

        /* get the user database info */
        const userCollection = await userDb();
        /* get the user */
        const user = await userCollection.findOne({ screen_name: username.toLowerCase() });
        /*  make sure we found the user! */
        if (user != null && user != undefined) {
            const newLikes = user.liked_shows;
            const newDislikes = user.disliked_shows;
            const newWatches = user.watched_shows;
            /* update the user in the database */
            if (user.liked_shows.includes(showId) && Number(likes) == -1) {
                /* remove the show from the user's likes */
                newLikes.splice(newLikes.indexOf(showId), 1);
            }
            if (user.disliked_shows.includes(showId) && Number(dislikes) == -1) {
                /* remove the show from the user's dislikes */
                newDislikes.splice(newDislikes.indexOf(showId), 1);
            }
            if (user.watched_shows.includes(showId) && Number(watches) == -1) {
                /* remove the show from the user's watched-list */
                newWatches.splice(newWatches.indexOf(showId), 1);
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
                throw `Error: Failed to update user data.`;
            }
            /* if user can be updated, upate show! */
            const updated = await showCollection.updateOne({ _id: ObjectId(showId) }, { $set: updatedShow });
            if (updated.matchedCount == 0 || updated.modifiedCount == 0) {
                throw `Failed to update show data.`;
            }
            return { showUpdated: true, userUpdated: true, data: updatedUser };
        } else {
            throw `Error: Failed to find user with username ${username} in database!`
        }
    } catch (e) {
        throw e;
    }
}

/*
 * Forms a list of recommendations for the user based on their
 * current show preferences
 */
async function getRecommendations(user) {
    try {
        // get document for current user
        const userCollection = await userDb();
        const foundUser = await userCollection.findOne({ screen_name: user.toLowerCase() });
        if (!(foundUser != undefined && foundUser != null)) {
            throw "Error: User with username " + user + " was not found in the database!";
        } else {
            // get list of liked shows for current user
            const liked_shows = foundUser.liked_shows;
            const watched_shows = foundUser.watched_shows;
            let likedGenres = {};
            // iterate through list of liked shows' id and get document from id
            const showCollection = await showDb();
            for (let i = 0; i < liked_shows.length; i++) {
                const foundShow = await showCollection.findOne({ _id: ObjectId(liked_shows[i]) });
                if (foundShow != undefined && foundShow != null) {
                    // get list of genres for current show
                    const showGenres = foundShow.genres;
                    // iterate through list of genres and add to frequency map
                    for (let j = 0; j < showGenres.length; j++) {
                        const genre = showGenres[j];
                        if (likedGenres[genre]) {
                            likedGenres[genre]++;
                        } else {
                            likedGenres[genre] = 1;
                        }
                    }
                }
            }
            // sort in descending order of most liked genre
            const likedArray = Object.keys(likedGenres);
            if (likedArray.length == 0) {
                return [];
            }
            likedArray.sort((g1, g2) => { return likedGenres[g2] - likedGenres[g1] });
            const fiveRecs = [];
            let index = 0;
            while (fiveRecs.length < 5 && index < likedArray.length) {
                // returns array of random shows with user's fav genre
                const recommendations = await showCollection.aggregate([{ $match: { genres: likedArray[index] } }]).toArray();

                // removes any shows that user has watched
                for (let i = 0; i < recommendations.length; i++) {
                    if (!watched_shows.includes(recommendations[i]._id.toString())) {
                        fiveRecs.push(recommendations[i]);
                    }
                    if (fiveRecs.length >= 5) {
                        break;
                    }
                }
                index++;
            }
            if (fiveRecs.length == 0) {
                throw "No recommendations found.";
            }
            // return only the top 5 
            return fiveRecs;
        }
    } catch (e) {
        throw e;
    }
}

/*
 * Returns an array of documents sorted in descending order by the given property 
 */
async function sortBy(docArray, prop){
    const sortedArray = docArray.sort(function(a,b){
        if (a[prop] < b[prop]){
            return 1;
        }
        if (a[prop] > b[prop]){
            return -1;
        }
        if (a[prop] === b[prop]){
            return 0;
        }
    });
    return sortedArray;
}

/*
 * Makes sure that the given parameter is a number within the range min-max
 */
function checkInt(int, min, max, name = 'number') {
    if (int == undefined || int == null) throw `Error: Expected ${name} to be a number, but it does not exist!`;
    if (isNaN(Number(int))) throw `Error: Expected ${name} to be a number, but failed to convert.`;
    if (Math.floor(Number(int)) != int) throw `Error: Expected ${name} to be an integer.`;
    if ((min != undefined && Number(int) < min) || (max != undefined && Number(int) > max)) throw `Error: Expected ${name} to be in the range ${min} - ${max}.`;
    return true;
}

module.exports = {
    searchDb,
    getAll,
    add,
    searchMaze,
    getShow,
    addManual,
    updateCounts,
    getRecommendations,
    checkInt,
    getPopular,
    sortBy
}