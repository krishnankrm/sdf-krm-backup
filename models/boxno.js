
const mongoose = require('mongoose')
var config = require('../config');
const url = config.url
mongoose.connect(url, {useUnifiedTopology: true});

const Jag = new mongoose.Schema({
   
    BoxNo: {
        type: String,
        required: true,
    },
    idno: {
        type: String,
        required: true,
    }    
})

module.exports = mongoose.model('Box',Jag)