const mongoose = require('mongoose');
const Joi = require ('joi');
const express = require('express');
const route = express.Router();
route.use(express.json())

mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser:true})
.then (()=> console.log('Connected to MongoDB..'))
.catch((err)=>console.log('Failed to connect...', err));

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength:5,
        maxlength:50
    },
    display: Boolean
});

const Genre = mongoose.model('Genre', genreSchema);

async function createGenre (name){
    const genre = new Genre({
        name: name,
        display: true
    })

    try{
        const result = await genre.save();
    }
    catch(e){
        console.log(e.message);
    }
    console.log(result);
};

async function getGenre(id){
    try{
        const genres = await Genre.find().select('name -_id');
        return genres;
    }
    catch(e){
        console.log(e.message());
    }
}


// GET ALL
route.get('/', async (req, res)=>{
    res.send(await getGenre(null));
});

// GET SPECIFIC
route.get('/:id', async (req, res)=>{
    try{
        const genre = await Genre.findById(req.params.id).select('name -_id');
        res.send (genre);
    }
    catch(e){
        res.status(404).send(e.message)
        return;
    }    
})

// POST - Add
route.post('/', (req, res)=>{
    const { error } = validateGenre(req.body);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }

    const genre = req.body.name; 
    createGenre (genre);

    res.status(200).send(genre);
});

// PUT - Update
route.put('/:id', async (req, res)=>{
    const { error } = validateGenre(req.body);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }

    try{
        const genre = await Genre.findByIdAndUpdate (req.params.id, {name: req.body.name}, {new: true});
        res.status(200).send(genre)
    }
    catch (err){
        res.status(404).send(err.message);
        return;
    }
        
});

// DELETE
route.delete('/:id', async (req, res)=>{

    try{
        const genre = await Genre.findByIdAndRemove(req.params.id);
        res.status(200).send(genre.name + " Deleted!")
    }
    catch (err){
        res.status(404).send(err.message);
        return;
    }
})


function validateGenre(genre){
    const schema = {
        name: Joi.string().min(4).required()
    };
    return Joi.validate (genre, schema);
}

module.exports = route;