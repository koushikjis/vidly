const Joi = require ('joi');
const mongoose = require('mongoose');
const express = require('express');
const route = express.Router();
route.use(express.json());

mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser:true})
    .then (()=>{console.log("Connected to DB...")})
    .catch(err=>{console.log("Failed to connect...", err)});

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength:5,
        maxlength:50
    }
});

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: String,
    genre: genreSchema,
    numberInStock: Number,
    dailyRentalRate: Number
}));

async function addMovie(movie){

    const newMovie = new Movie({
        title: movie.title,
        genre: {name:movie.genre},
        numberInStock: movie.numberInStock,
        dailyRentalRate: movie.dailyRentalRate
    })

    return await newMovie.save();
    
}

route.post('/', async (req, res)=>{
    const { error } = validateMovie(req.body);
    if (error){
        res.status(400).send(error.message);
        return 1;
    }

    const result = await addMovie(req.body);
    res.status(200).send(result);
})

function validateMovie(movie){
    const schema = {
        title: Joi.string().required(),
        genre: Joi.string().required(),
        numberInStock: Joi.number().required(),
        dailyRentalRate: Joi.number().required()
    }

    return Joi.validate(movie, schema);
}

module.exports = route;