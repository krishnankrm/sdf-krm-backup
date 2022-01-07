const express = require('express')
const router = express.Router()
var config = require('../config');
const url = config.url
// var mongodb= require('mongodb');
var MongoClient = require('mongodb').MongoClient;

router.post('/', async(req,res) => {
    console.log("Check table")
    var returnobject={pouches:[],item:[]}; var flag=1
    let d100=new Promise(async function(myResolve, myReject) {MongoClient.connect(url, async function(err, db) {
        if (err) throw err;
        var dbo = db.db("sdf_poc");
        var query ={"POid":req.body.POid};
        dbo.collection("poucheslists").find(query,{ projection: { _id:0, Pouchid:1 }}).toArray(async function(err, result) {
          if (err) throw err;
          console.log(result)
          if(result.length!=0)
           {     
                for (let k in result)
                returnobject.pouches.push(result[k].Pouchid)
                myResolve(1)
            }   
        else
        {myResolve(0)}
    })
})})
var k=await d100;
let d101=new Promise(async function(myResolve, myReject) {MongoClient.connect(url, async function(err, db) {
    if (err) throw err;
    var dbo = db.db("sdf_poc");
    var query ={"POid":req.body.POid};
    dbo.collection("items").find(query,{ projection: { _id:0, Items:1 }}).toArray(async function(err, result) {
      if (err) throw err;
      if(result.length!=0)
       {                     
           for (let k in result)
            {for (let r in result[k]['Items'])
            {  console.log(result[k]['Items'][r])
                if(result[k]['Items'][r]['Itemquantity']!=0)
            {returnobject.item.push(result[k]['Items'][r]['Itemcode'])}}}
                myResolve(1)
        }
          
    else
    {myResolve(0)}
})
})})
var k1=await d101;
return res.json(returnobject)
 
})
module.exports = router