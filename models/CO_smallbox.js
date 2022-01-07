
const mongoose = require('mongoose')
var config = require('../config');
const url = config.url
mongoose.connect(url, {useUnifiedTopology: true});

const Jag = new mongoose.Schema({
    Datenow: {
        type: Date,
        required: true,
    }, 
    Name_desc: {
        type: String,
        required: true,
    },   
    packageType: {
        type: String,
        required: true
    },
    PartNumber: {
        type: String,
        required: true,
    }, 
    WEIGHT_UNIT: {
        type: String,
        required: true
    },
    PO_Quantity: {
        type: String,
        required: true
    },
    Quantity: {
        type: String,
        required: true
    },
    SmallBox_Label: {
        type: String,
        required: true,
    },
    Remarks: {
        type: String,
        required: true,
    },
    GrossWeight: {
        type: String,
        required: true,
    },
    Operator: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('CO_SmallBox',Jag)