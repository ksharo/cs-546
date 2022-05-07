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
In order to run this application, if you have npm installed, use the following commands:

`npm i`
`npm run seed`

*Note: this will take a moment, as seeding with 150 tv shows, 150 users, and several hundred reviews is a lot of work for our server*

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
