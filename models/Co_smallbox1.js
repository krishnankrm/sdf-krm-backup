
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
    Pouch_Label: {
        type: Array,
        required: true,
    }, 
    PartNumber: {
        type: Array,
        required: true,
    }, 
    WEIGHT_UNIT: {
        type: Array,
        required: true
    },
    Quantity: {
        type: Array,
        required: true
    },
    Remarks: {
        type: Array,
        required: true,
    },
    Name_desc: {
        type: Array,
        required: true,
    },
    Smallbox1_Label: {
        type: String,
        required: true,
    },  
    Netweight: {
        type: String,
        required: true
    } ,
    Operator: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('CO_SmallBox1',Jag)