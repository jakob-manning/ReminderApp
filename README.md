# ReminderApp
 A class project for BCIT 2912

## To Run
- add a .env file with MongoDB connection string and cookie secret  
- run "node index.js"

## To View Live
https://reminder-app-3000.herokuapp.com/

#Features
###Authentication
Server-session model using hashed passwords and an external database  
Routes are protected and users are automatically redirected when requesting forbidden routes

###Mongo-DB Implementation
Users, Sessions, and Data are stored on a MongoDB Atlas database.

###API End Points
Reminders can be created, listed, updated, and deleted  
Users can be created, listed, and followed

###NoSQL Data Structure
Reminders have a user property with a unique ID pointing to their owner   
Users have an array of reminder IDs pointing to their reminders   
Users have arrays for "friends" and "followed by" pointing to other users

###Mongoose Data Schemas
Schemas are enforced by Mongoose

###Model View Controller with EJS "Views"
Views are provided via the EJS templating engine

###External Photo API
Profile photos are automatically generated using the randomuser.me api.

###Hosting with Heroku
Updates are pushed live to Heroku

###Robust Error Handling
All errors are handled in try/catch blocks with fallbacks.

###Error Handling
Errors and bad requests are presented to the user in a friendly error page with custom description text.

###User Search
All users are presented at GET /collaborate. Users results can be filtered with the search box.

###404 Page
Incomplete routes are redirected to a 404 page.
