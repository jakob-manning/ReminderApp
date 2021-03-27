## Jakob Manning:
###March 20th (First Sprint)
- Watch lecture videos  
- Update routes and project structure (separate routes and concontrol, add redirects from homepage)  
- Complete API end points (EDIT, DELETE)
- Implemented .env variables with DOTENV  
- Research Mongo-DB & Mongoose integration  
- Research Bcrypt password hashing  
- Connect to Database  
- Implement User Schema  
- Implement registration  
- Implement log-in
  
  
###March 27  (Second Sprint)  
- Move reminders to MongoDB
- implement auth controls
    - write new middleware
    - check user credentials are key routes
- implement "follow" feature
    - add collaborate routes
    - add collaborate controllers
        - implement add and remove actions
    - add collaborate view
        - add search feature for users
        - logic for users who are/are not friends
    - update user schema to include "friends" and "followed by"
    - add collaborate functionality ( fetch users from database, list users, present users)
    - update reminder list to include friends reminders
- Implement external API
    - add photos from randomuser.me
    - error handle for when API breaks
- clean up presentation
    - new templates for reminder list, reminder edit, login page 
    - add 404 catch page
    - Implement error handling route
- host on heroku
    - Procfile
    - node engine
    - cleaned up packages.json
- Testing
    - testing routes 
    - testing bad requests
    


