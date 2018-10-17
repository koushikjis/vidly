const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser:true})
    .then (()=>{console.log("Connected to DB...")})
    .catch(err=>{console.log("Failed to connect...", err)});

module.exports = mongoose;