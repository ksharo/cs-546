const dbConnection = require("../config/mongoConnection");
const data = require("../data");
const showData = data.showData;
const accountData = data.accountData;
const { uniqueNamesGenerator, adjectives, colors, animals, names } = require('unique-names-generator');

async function main() {
    const db = await dbConnection.connectToDb();

    await db.collection("users").drop();
    await db.collection("shows").drop();
    // await db.collection("reviews").drop();

    // used https://stacker.com/stories/980/100-best-tv-shows-all-time for suggestions
    const showsToAdd = [41135, 8208, 168, 6489, 490, 1259, 563, 431, 1251, 1249, 526, 174, 210, 21845, 672, 713, 67, 81, 682, 80, 954, 5876, 37142, 1198, 921, 57789, 2950, 610, 41749, 517, 543, 323, 49, 2790, 171, 38963, 13, 111, 43102, 107, 538, 216, 41007, 28276, 1367, 532, 13417, 23470, 44933, 123, 56625, 17377, 7, 541, 167, 2427, 3606, 204, 343, 2029, 157, 164, 178, 15296, 43, 559, 2, 16579, 158, 172, 19, 994, 342, 1825, 143, 3080, 102, 16544, 150, 716, 318, 194, 76, 1871, 781, 290, 106, 565, 151, 491, 17128, 315, 3594, 430, 29191, 385, 10822, 41428, 83, 1369, 1371, 161, 17078, 663, 31, 19807, 748, 551, 47119, 2103, 367, 184, 755, 166, 677, 321, 15299, 112, 118, 175, 2993, 523, 263, 44458, 156, 347, 530, 17861, 618, 2705, 396, 32, 5, 787, 33153, 3880, 3289, 4050, 3327, 3853, 1471, 757, 11, 180, 335, 527, 82, 555, 179, 169]

    /* add all the initial shows to the database */
    const addedIds = [];
    for (let x of showsToAdd) {
        let thisShow = await showData.add(x);
        addedIds.push(thisShow.showData._id.toString());
    }

    /* add as many users as shows for more data */
    for (let _ in showsToAdd) {
        const username = uniqueNamesGenerator({
            dictionaries: [adjectives, animals],
            style: 'capital',
            separator: '',
        }); // adjective, then color, then animal for username (screenname)
        let firstName = uniqueNamesGenerator({
            dictionaries: [names]
        });
        let lastName = uniqueNamesGenerator({
            dictionaries: [names]
        });

        while (!isAlphanum(firstName)) {
            firstName = uniqueNamesGenerator({
                dictionaries: [names]
            });
        }
        while (!isAlphanum(lastName)) {
            firstName = uniqueNamesGenerator({
                dictionaries: [names]
            });
        }
        await accountData.createUser(firstName, lastName, username + '@123.com', username, '123456');

        /* add random shows to the user's watched, liked, and disliked */
        const num_shows = Math.floor(Math.random() * 40) + 1;
        const shuffled = addedIds.sort(() => 0.5 - Math.random());
        for (let i = 0; i < num_shows; i++) {
            /* evens get likes, odds get dislikes */
            try {
                await showData.updateCounts(shuffled[i], username, i % 2 == 0 ? 1 : 0, i % 2 == 0 ? 0 : 1, 1);
            } catch (e) {
                console.error(e);
            }
        }
    }

    await dbConnection.closeConnection();
    console.log('Done seeding!');
    return;
}

const isAlphanum = (name) => {
    const alphanum = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (let x of name) {
        if (!alphanum.includes(x.toLowerCase())) {
            return false;
        }
    }
    return true;
}

main().catch((error) => {
    console.log(error);
});