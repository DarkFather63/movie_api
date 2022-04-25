const express = require('express');
const app = express();

let myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};

app.use(myLogger);


let myFaveMovies = [
  {
    title:'Lord of the Rings: The Fellowship of the Ring' ,
    director:'Peter Jackson'
  }
  {
    title:'Lord of the Rings: The Two Towers' ,
    director:'Peter Jackson'
  }
  {
    title:'Lord of the Rings: The Return of the King' ,
    director:'Peter Jackson'
  }
  {
    title:'Seven Samurai' ,
    director:'Akira Kurosawa'
  }
  {
    title:'Hidden Fortress' ,
    director:'Akira Kurosawa'
  }
  {
    title: 'Kingdom of Heaven',
    director:'Ridley Scott'
  }
  {
    title:'The Thing' ,
    director:'John Carpenter'
  }
  {
    title:'Alien' ,
    director:'Ridley Scott'
  }
  {
    title:'Porco Rosso' ,
    director:'Hayao Miyazaki'
  }
  {
    title:'Star Wars: Episode IV - Return of the Jedi' ,
    director:'Richard Marquand'
  }
];

app.get('/', (req, res) => {
  res.send('Welcome to the MyMovies App!');
});

app.get('/movies', (req, res) => {
  res.json(myFaveMovies);
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke! :(');
});


app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
