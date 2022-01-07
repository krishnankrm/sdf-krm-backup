
const mongoose = require('mongoose')
var config = require('../config');
const url = config.url
mongoose.connect(url, {useUnifiedTopology: true});

const Jag = new mongoose.Schema({

    Datenow: {
        type: Date,
        required: true,
    },   
    packageType: {
        type: String,
        required: true
    },
    StackNo: {
        type: String,
        required: true
    },
    ModelNo: {
        type: Array,
        required: true,
    },
    Sap: {
        type: Array,
        required: true
    },
    Transport: {
        type: String,
        required: true,
    },
    boxNo: {
        type: String,
        required: true,
    }, 
    gross_weight: {
        type: Array,
        required: true,
    },
    tare_weight: {
        type: Array,
        required: true,
    },  
    net_weight: {
        type: String,
        required: true,
    },
    Operator: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('transmission',Jag)