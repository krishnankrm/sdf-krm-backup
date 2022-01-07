
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
    SmallBox_Label: {
        type: Array,
        required: true,
    }, 
    BigBox_Label: {
        type: String,
        required: true,
    },
    Transport: {
        type: String,
        required: true,
    },
    GrossWeight: {
        type: String,
        required: true
    },
    Box_Type: {
        type: String,
        required: true,
    },   
    length: {
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
    Tareweight: {
        type: String,
        required: true,
    },
    Netweightofsb: {
        type: String,
        required: true
    } ,
    Calculatedweight: {
        type: String,
        required: true
    } ,
    Operator: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('CO_BigBox',Jag)