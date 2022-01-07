
const mongoose = require('mongoose')
var config = require('../config');
const url = config.url
mongoose.connect(url, {useUnifiedTopology: true});

const Jag = new mongoose.Schema({
   
    Sizelist: {
        type: String,
        required: true,
    },
    Length: {
        type: String,
        required: true,
    }    ,
    Breadth: {
        type: String,
        required: true,
    },
    Height: {
        type: String,
        required: true,
    }  ,  
    Tare_Weight: {
        type: String,
        required: true,
    }  ,  
})

module.exports = mongoose.model('Boxlist',Jag)