const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');

app.use(bodyParser.json());

let users = [
  {
      id: 1,
      name:'John',
      favoriteMovies: []
  },
  {
      id: 2,
      name:'Sam',
      favoriteMovies: ['Seven Samurai']
  }
];

let movies = [
  {
    'Title':'Lord of the Rings: The Fellowship of the Ring' ,
    'Genre':{
      'Name':'Fantasy',
      'Description': 'Fantasy is a genre of speculative fiction involving magical elements, typically set in a fictional universe and sometimes inspired by mythology and folklore. '
    },
    'Director':{
      'Name':'Peter Jackson',
      'Bio':'Sir Peter Robert Jackson ONZ KNZM is a New Zealand film director, screenwriter, and film producer. He is best known as the director, writer, and producer of the Lord of the Rings trilogy and the Hobbit trilogy, both of which are adapted from the novels of the same name by J. R. R. Tolkien.'
    },
    'Synopsis':'The future of civilization rests in the fate of the One Ring, which has been lost for centuries. Powerful forces are unrelenting in their search for it. But fate has placed it in the hands of a young Hobbit named Frodo Baggins (Elijah Wood), who inherits the Ring and steps into legend. A daunting task lies ahead for Frodo when he becomes the Ringbearer - to destroy the One Ring in the fires of Mount Doom where it was forged.'
  },

  {
    'Title':'Lord of the Rings: The Two Towers' ,
    'Genre':{
      'Name':'Fantasy',
      'Description': 'Fantasy is a genre of speculative fiction involving magical elements, typically set in a fictional universe and sometimes inspired by mythology and folklore. '
    },
    'Director':{
      'Name':'Peter Jackson',
      'Bio':'Sir Peter Robert Jackson ONZ KNZM is a New Zealand film director, screenwriter, and film producer. He is best known as the director, writer, and producer of the Lord of the Rings trilogy and the Hobbit trilogy, both of which are adapted from the novels of the same name by J. R. R. Tolkien.'
    },
    'Synopsis':'The sequel to the Golden Globe-nominated and AFI Award-winning "The Lord of the Rings: The Fellowship of the Ring," "The Two Towers" follows the continuing quest of Frodo (Elijah Wood) and the Fellowship to destroy the One Ring. Frodo and Sam (Sean Astin) discover they are being followed by the mysterious Gollum. Aragorn (Viggo Mortensen), the Elf archer Legolas and Gimli the Dwarf encounter the besieged Rohan kingdom, whose once great King Theoden has fallen under Saruman\'s deadly spell.'
  },

  {
    'Title':'Lord of the Rings: The Return of the King' ,
    'director':'Peter Jackson'
  },

  {
    'Title':'Seven Samurai' ,
    'director':'Akira Kurosawa'
  },

  {
    'Title':'Hidden Fortress' ,
    'director':'Akira Kurosawa'
  },

  {
    'Title': 'Kingdom of Heaven',
    'director':'Ridley Scott'
  },

  {
    'Title':'The Thing' ,
    'director':'John Carpenter'
  },

  {
    'Title':'Alien' ,
    'director':'Ridley Scott'
  },

  {
    'title':'Porco Rosso' ,
    'director':'Hayao Miyazaki'
  },

  {
    'title':'Star Wars: Episode IV - Return of the Jedi' ,
    'director':'Richard Marquand'
  }
];

//CREATE
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name){
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('Could not add user.')
  }
});

//UPDATE
app.put('/users/:id', (req, res) => {
  const { id }= req.params
  const updatedUser = req.body;

  let user = users.find( user => user.id == id );

  if (user){
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user')
  }
});

//CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle }= req.params

  let user = users.find( user => user.id == id );

  if (user){
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array.`);
  } else {
    res.status(400).send('no such user')
  }
});

//DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle }= req.params

  let user = users.find( user => user.id == id );

  if (user){
    user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array.`);
  } else {
    res.status(400).send('no such user')
  }
});

//DELETE
app.delete('/users/:id', (req, res) => {
  const { id }= req.params

  let user = users.find( user => user.id == id );

  if (user){
    users = users.filter(user => user.id != id);
    res.status(200).send(`User ${id} has been deleted.`);
  } else {
    res.status(400).send('no such user')
  }
});

//READ
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

//READ
app.get('/movies/:title', (req, res) => {
  const { title }= req.params;
  const movie = movies.find(movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie')
  }
});

//READ
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName }= req.params;
  const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre')
  }
});

//READ
app.get('/movies/director/:directorName', (req, res) => {
  const { directorName }= req.params;
  const director = movies.find(movie => movie.Director.Name === directorName).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('no such director')
  }
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
