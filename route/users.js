const express = require('express');
const route = express.Router();
route.use(express.json());

route.get('/', (req, res)=>{
    res.status(200).send('Hi')
})