
const mongoose = require('mongoose')
var config = require('../config');
const url = config.url
mongoose.connect(url, {useUnifiedTopology: true});

const Jag = new mongoose.Schema({
    material: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true,
    }, 
    type: {
        type: String,
        required: true
    },    
    total: {
        type: String,
        required: true,
    } ,
    remaining: {
        type: Number,
        required: true,
    } ,
    Transport: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('SAP_Trans',Jag)