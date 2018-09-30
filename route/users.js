const Joi = require ('joi');
const mongoose = require('mongoose');
const express = require('express');
const route = express.Router();
route.use(express.json());

mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser:true})
    .then (()=>{console.log('Connect to Mongo...')})
    .catch((err)=>{console.log("Failed to connect", err)});

const User = mongoose.model('User', new mongoose.Schema({
    isGold: Boolean,
    name: String,
    phone: {
        type:Number,
        minlength:10,
        maxlength:10
    }
}))


route.get('/', async (req, res)=>{
    try{
        const users = await User
            .find()
            .select('name -_id');
        res.status(200).send(users)
    }
    catch(err){
        res.send(404).send(err.message);
        return
    }
});

route.post('/', (req, res) => {
    const { error } =  validateUser (req.body);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    
    const user = req.body;
    createUser(user);

    res.status(200).send(user);
})

async function createUser(user){
    const newUser = new User({
        isGold: user.isGold,
        name: user.name,
        phone: user.phone
    })

    try{
        const result = await newUser.save();
    }
    catch(e){
        console.log(e.message);
    }
    console.log(result);
}

function validateUser(user){
    const schema = {
        name: Joi.string().min(4).required(),
        phone: Joi.number().required(),
        isGold: Joi.boolean().required()
    };
    return Joi.validate (user, schema);
}

module.exports = route;
