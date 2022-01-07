
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
    engineType: {
        type: String,
        required: true,
    }, 
    Pno: {
        type: String,
        required: true
    },
    serial_number: {
        type: String,
        required: true,
    },
    Sap: {
        type: String,
        required: true
    },    
    BoxNo: {
        type: String,
        required: true,
    }, 
    Transport: {
        type: String,
        required: true,
    }, 
    Length: {
        type: String,
        required: true
    },    
    Width: {
        type: String,
        required: true,
    }, 
    Height: {
        type: String,
        required: true,
    },
    Gross_weight: {
        type: String,
        required: true,
    }, 
    Tare_weight: {
        type: String,
        required: true,
    }, 
    Net_weight: {
        type: String,
        required: true,
    },
    Operator: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Engine',Jag)