# What2Watch
## CS 546 Spring 2022 Final Project
What2Watch is a web application that allows individuals to like, dislike, and review the TV shows that they've watched. 

There are several main components to this application:
1. The home page, where users can search for a show, learn more about the website, and see the most liked and most watched TV shows.
2. The All Shows page, where users can browse through all of the shows in our database, sorting and filtering by name, genre, most likes, most dislikes, and most watches.
3. The Individual Show page, where users can see more information about a single show, including a summary and reviews that users have left.
4. The User Profile page, where a logged-in user can view the shows they've liked, watched, and disliked; see their reviews; and see recommendations that we have for them.
5. The Add TV Show page, where a logged-in user can add a tv show to the database, either by hand or using the TV Maze API.
6. The Other User page, where a logged-in user can look at other users' profiles to see their favorite shows, their reviews, and their recommendations.

### Running the Application
---
#### Prepping
In order to run this application, if you have npm installed, use the following command:

`npm i`

#### Seeding
To seed the application, we have provided the DB_dump directory. This contains 3 json files, one for each of our collections. In order to use these files, open up compass and create a database called what2watch. Next, make three empty collections: users, reviews, and shows. Then import these json files into their appropriate collections and you're ready to go!
#### Alternative (slow - not recommended!):

`npm run seed`

*Note: this will take a moment, as seeding with 150 tv shows, 150 users, and several hundred reviews is a lot of work for our server. If it gets stuck adding reviews, that's okay, just CTRL+C to stop it. Sometimes Mongo gets a broken pipe when our seed file runs, another reason to use the DB dump instead! *

#### Starting

`npm start`

Then navigate in your browser to http://localhost:3000 and start exploring!

### Some key features to note:
---
1. Users can leave reviews anonymously. These reviews do not show up when another user looks at their profile.
2. Users can choose and edit their profile pictures from our list of fun and cute pictures.
3. Users can edit or delete any reviews they have made.
4. If the user is offline, we do not let them access the add tv show page, because in order to add a tv show, we need to use axios, which needs internet connection.
5. When users search for a show, we search by name first, then by genre, then by summary, in order to encapsulate the greatest number of possible results that the user could want.
6. Hovering over links and images sometimes does cool things, like giving the user more information about that show or enlarging the image. Try it out!

### About streaming services (extra feature):
We have implemented streaming services for each show, meaning that we list the streaming services/purchase options available for each tv show on our site. In order to do this, we use the watchmode API, which allows developers 1000 free calls per month. With our seed size of 150 shows, we can only re-seed a few times with the streaming services.

Therefore, we do not have the API key included in our application, which is needed to access these streaming services. See the demo for what it looks like when the API key is included or create your own to test it out!
The API key can go in showData.js, line 115. 

This is another reason why we recommend you use the DB Dump directory rather than seeding because the DB Dump has the streaming services that we gather from the watchmode API. 