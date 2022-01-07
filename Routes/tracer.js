const express = require('express')
const router = express.Router()
var config = require('../config');
const url = config.url
var MongoClient = require('mongodb').MongoClient;

router.post('/', async (req,res100) => {
    var pouchlist=[]
    var promise1=new Promise((resolve,reject)=>{
        MongoClient.connect(url,(err,db)=>{
            var dbo = db.db("sdf_project_ver2");
            var query={BigBox_Label:req.body.bbid}
            dbo.collection('co_bigboxes').find(query,{ projection: { _id:0, SmallBox_Label:1}}).toArray(function(err, result) {
                if(result.length==0)
                {  res100.json('No data available');return}
                else
                {   
                    resolve(result[0].SmallBox_Label)
                }
            })
        })   
    })
    var smallboxarray=await promise1
    smallboxarray.forEach(async(element,index) => {
        var promise2=new Promise((resolve,reject)=>{
            MongoClient.connect(url,(err,db)=>{
                var dbo = db.db("sdf_project_ver2");
                var query={Smallbox1_Label:element}
                dbo.collection('co_smallbox1').find(query,{ projection: { _id:0, Pouch_Label:1, PartNumber:1, Quantity:1}}).toArray(function(err, result) {
                    pouchlist.push(result[0])
                    resolve(1)
                })
            })        
        })
        var response2=await promise2
        if(pouchlist.length==smallboxarray.length)     
         res100.json({"smallboxarray":smallboxarray,"pouchlist":pouchlist})
    });       
})

 module.exports = router
