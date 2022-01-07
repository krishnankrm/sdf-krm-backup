
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
    PartNumber: {
        type: Array,
        required: true,
    }, 
    GrossWeight: {
        type: Array,
        required: true
    },
    Box_Type: {
        type: String,
        required: true,
    },
    Box_Name: {
        type: String,
        required: true
    },    
    lenght: {
        type: String,
        required: true,
    }, 
    breadth: {
        type: String,
        required: true,
    },  
    height: {
        type: String,
        required: true,
    }, 
    Boxweight: {
        type: String,
        required: true,
    },
    Netweight: {
        type: String,
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
    Operator: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Otherpart',Jag)