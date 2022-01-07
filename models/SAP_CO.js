
const mongoose = require('mongoose')
var config = require('../config');
const url = config.url
mongoose.connect(url, {useUnifiedTopology: true});

const Jag = new mongoose.Schema({
    Datenow: {
        type: Date,
        required: true,
    },   
    pno: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true,
    }, 
    Supplier: {
        type: String,
        required: true
    },    
    Admin: {
        type: String,
        required: true,
    }, 
    
    total: {
        type: String,
        required: true
    },

    remaining: {
        type: Number,
        required: true,
    },   
    
    remaining1: {
        type: Number,
        required: true,
    },

    Transport: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('SAP_CO',Jag)