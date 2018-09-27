const genres = require('./module/genres');
const express = require('express');
const app = express();

app.use('/api/genres', genres);
app.use(express.json())

const PORT = 4000;
app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})