const Joi = require ('joi');
const express = require('express');
const route = express.Router();
const mongoose = require('../module/database');
route.use(express.json());

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
});

route.put('/:id', (req, res)=>{
	console.log(req.param.id);
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
