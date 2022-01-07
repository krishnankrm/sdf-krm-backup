const express = require('express')
const router = express.Router()
var config = require('../config');
const url = config.url
var mongodb= require('mongodb');
var MongoClient = require('mongodb').MongoClient;


router.post('/PO', async (req,res) => {
  console.log("PO - Analyser")
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("sdf_poc");
    var query={}
    if(req.body.POid!='')
    query.POid=req.body.POid
    if(req.body.Start!='' && req.body.Stop!='')
    {
      var start= new Date(req.body.Start);
      var end=  new Date(req.body.Stop);
      query.Datenow={
            "$gte": start,
            "$lt": end
          }
    }
    if(req.body.OperatorId!='')
    query.OperatorId=req.body.OperatorId

    dbo.collection("forms").find(query, { projection: { _id:0, POid:1,  Customer_name:1, PO_Promise_date:1, OperatorId:1, Items:1, Datenow:1}}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result.length)
      if(result.length!=0)
        return res.status(200).json(result)  
      else
        return res.status(404).json({msg: "No records found for this Query"});
    });
  });
})

router.post('/Pouch', async (req,res) => {
  console.log("Pouch - Analyser")
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("sdf_poc");
    var query={}
    if(req.body.POid!='')
    query.POid=req.body.POid
    if(req.body.Pouchid!='')
    query.Pouchid=req.body.Pouchid
    if(req.body.Start!='' && req.body.Stop!='')
    {
      var start= new Date(req.body.Start);
      var end=  new Date(req.body.Stop);      
      query.Datenow={
        "$gte": start,
        "$lt": end
      }
    }
    if(req.body.OperatorId!='')
    query.OperatorId=req.body.OperatorId
    console.log(query)
    dbo.collection("pouches").find(query, { projection: { _id:0, Pouchid:1,  POid:1, Pouch:1, Datenow:1, OperatorId:1}}).toArray(function(err, result) {
      if (err) res.status(404).json({msg: err})
      if(result.length!=0)
        return res.status(200).json(result)  
      else
        return res.status(404).json({msg: "No records found for this Query"});
    });
  });
})

router.post('/small_box', async (req,res) => {
  console.log("small_box - Analyser")
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("sdf_poc");
    var query={}
    if(req.body.POid!='')
    query.POid=req.body.POid
    if(req.body.Smallboxid!='')
    query.Smallboxid=req.body.Smallboxid
    if(req.body.Start!='' && req.body.Stop!='')
    {
      var start= new Date(req.body.Start);
      var end=  new Date(req.body.Stop);      
      query.Datenow={
        "$gte": start,
        "$lt": end
      }
    }
    if(req.body.OperatorId!='')
    query.OperatorId=req.body.OperatorId
    console.log(query)
    dbo.collection("smallboxes").find(query, { projection: { _id:0}}).toArray(function(err, result) {
      if (err) res.status(404).json({msg: err})
      if(result.length!=0)
        return res.status(200).json(result)  
      else
        return res.status(404).json({msg: "No records found for this Query"});
    });
  });
})

router.post('/ship_box', async (req,res) => {
  console.log("ship_box - Analyser")
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("sdf_poc");
    var query={}
    if(req.body.POid!='')
    query.POid=req.body.POid
    if(req.body.Shipboxid!='')
    query.Shipboxid=req.body.Shipboxid
    if(req.body.Start!='' && req.body.Stop!='')
    {
      var start= new Date(req.body.Start);
      var end=  new Date(req.body.Stop);      
      query.Datenow={
        "$gte": start,
        "$lt": end
      }
    }
    if(req.body.OperatorId!='')
    query.OperatorId=req.body.OperatorId
    console.log(query)
    dbo.collection("shipboxes").find(query, { projection: { _id:0}}).toArray(function(err, result) {
      if (err) res.status(404).json({msg: err})
      if(result.length!=0)
        return res.status(200).json(result)  
      else
        return res.status(404).json({msg: "No records found for this Query"});
    });
  });
})


module.exports = router
