const genres = require('./route/genres');
const users = require('./route/users');
const movies = require('./route/movies');
const express = require('express');
const app = express();

app.use('/api/genres', genres);
app.use('/api/users', users);
app.use('/api/movies', movies);
app.use(express.json())

const PORT = 4000;
app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})