
const mongoose = require('mongoose')
var config = require('../config');
const url = config.url
mongoose.connect(url, {useUnifiedTopology: true});

const Jag = new mongoose.Schema({
    material: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
    },     
    dimension: {
        type: String,
    } ,
    uom: {
        type: String,
    } ,
    noofpieces: {
        type: Number,
    } ,
    gross: {
        type: String,
    } ,
    net: {
        type: String,
    } ,
    tare: {
        type: String,
    } ,
    packing_type: {
        type: String,
    } ,
    commodity: {
        type: String,
    } ,
    remarks: {
        type: String,
    } 
})

module.exports = mongoose.model('SAP_Weight_trans1',Jag)