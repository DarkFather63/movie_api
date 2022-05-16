#README

##Purpose of This App: myFlixDB app:
The goal of making this app was to create an app that could:
● Return a list of ALL movies to the user
● Return data (description, genre, director, image URL, whether it’s featured or not) about a
single movie by title to the user
● Return data about a genre (description) by name/title (e.g., “Thriller”)
● Return data about a director (bio, birth year, death year) by name
● Allow new users to register
● Allow users to update their user info (username, password, email, date of birth)
● Allow users to add a movie to their list of favorites
● Allow users to remove a movie from their list of favorites
● Allow existing users to deregister

##My Role:
My role in creating this app was that of a server-side developer. I built the base REST API from scratch using Javascript,
Mongo, Mongoose, Node.js, and Express. I also served as the client-side, testing all endpoints using Postman.

My decisions along the way included the following:

  ● As required, the app uses current authentication and authorization standards. This ensures security of data and protection
  from any modern cyber attack.
  ● I started the API and database with basic information, so the app is fairly small for now. However, because of how it's structured, it will be easy to add users and movies and grow the app. I am able to make requests to the server and database via my endpoints to do so, along with JWT authentication.
  ● If I could have, I would have come up with more unique and clear names for files and database objects and variables. I find that some of them can get confused and I have to backtrack and debug errors that come from this. Most of them are the default names for the base project, but I think they could be improved on.
  ● Through this project, I learned the complexity of backend programming. There's a lot of software involved, including a CLI (my own in this case, on my Macbook), a text editor, git, Postman, and PostgreSQL for the basics, and on top of that whole libraries of tools that can be implemented locally or globally, and whose commands are varied and often have a syntax of their own. This app in particular uses at least ten libraries or packages, alongside several middleware packages, and is hosted using Heroku and MongoDB. Keeping track of this software made me realize how important each piece is to an application, and how much I still have to learn. That said, I love using the CLI to send these package commands along and run queries and checks and tests. If I lose track, the CLI helped me a lot to figure out what I missed.


##Screenshot of App currently:
Pending


##Link to Live app:

https://dashboard.heroku.com/apps/eryns-moviedb-app

NOTE: Frontend of app has not yet been designed. This is the backend logic only.

##Link to Github repo:

https://github.com/DarkFather63/movie_api

##Technologies used:

  Node.js
  React
  MongoDB
  Express
  Multiple Node.js packages
  Heroku (as hosting service)
