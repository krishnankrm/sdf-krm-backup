
const mongoose = require('mongoose')
var config = require('../config');
const url = config.url
mongoose.connect(url, {useUnifiedTopology: true});

const Jag = new mongoose.Schema({
    Bigboxlabel: {
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
    } 
    
    
})

module.exports = mongoose.model('Bigboxslip',Jag)