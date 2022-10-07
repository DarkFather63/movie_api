const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'https://eryn-moviedb.herokuapp.com/movies', 'https://erynsawesomemyflix.netlify.app', 'http://localhost:4200', 'https://darkfather63.github.io/myFlix-Angular-client', 'https://darkfather63.github.io'];

//Disallow cross origin access
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./model.js');
const { check, validationResult } = require('express-validator');
const { application } = require('express');

const Movies = Models.Movie;
const Users = Models.User;

//mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());


/** Gets the main endpoint from the application. **/
app.get('/', (req, res) => {
  res.send('Welcome to my movie app!');
});


/** CREATE
* Add a user
* We'll expect JSON in this format in the request body:
*{
*  ID: Integer,
* Username: String,
* Password: String,
* Email: String,
* Birthday: Date
*}
* @param users
* @returns new user
*/
app.post('/Users', [
  check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid.').isEmail()
], (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists.');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error:' + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error:' + error);
    });
});

/** READ
* Get all movies
* No body needed in request
* @param movies
* @returns movies array
*/
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

/** READ
* Get one movie
* No body needed in request
* @param movies
* @param title
* @returns movie object
*/
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

/** READ
* Get movie(s) by genre
* No body needed in request
* @param genre
* @param genreName
* @returns genre object
*/
app.get('/genre/:Name', (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name })
    .then((movies) => {
      res.json(movies.Genre.Description);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

//REMEMBER SCHEMA IS CASE SENSITIVE
/** READ
* Get director
* No body needed in request
* @param director
* @param directorName
* @returns director object
*/
app.get('/director/:Name', (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name })
    .then((movies) => {
      res.json(movies.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});


/** READ
* Get all users
* No body needed in request
* @param users
* @returns users array
* for use only in database maintenance
*/
app.get('/Users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

/** READ
* Get a user by username
* No body needed in request
* @param users
* @param username
* @returns user object
*/
app.get('/Users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

/** UPDATE
* PUT update to user
* Request body expected in JSON format:
* {
*  Username: String,
*  (required)
*  Password: String,
*  (required)
*  Email: String,
*  (required)
*  Birthday: Date
* }

* @param id
* @returns updated user
*/

app.put('/Users/:Username', [
  check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid.').isEmail()
], (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  Users.findOneAndUpdate({ Username: req.params.Username },
    {
      $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }, //this line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error:' + err);
      } else {
        res.json(updatedUser);
      }
    });
});


/**  UPDATE
* Post one movie to user's list of favorites
* Expected body data format: JSON object, and movie title in URL
* Example: {
* "name": "John",
* "favoriteMovies": []
* }
* @param userId
* @param movieId
* @returns movie object in user array
*/
app.post('/Users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    {
      $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, //makes sure the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

//DELETE - allows user to remove a movie from their favorites
/** DELETE
* Delete one movie from user's list of favorites
* Expected body data format: JSON object, and movie title in URL
* Example: {
* "name": "John",
* "favoriteMovies": []
* }
* @param userId
* @param movieId
* @returns updated favorites array
*/
app.delete('/Users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    {
      $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, //makes sure the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

//DELETE - allows a user to be deleted via username
/**  DELETE
* Post one movie to user's list of favorites
* Expected body data format: JSON object, and user id in URL
* Example: {
* "name": "John",
* "favoriteMovies": []
* }
* @param userId
* @returns string response if success
*/
app.delete('/Users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
