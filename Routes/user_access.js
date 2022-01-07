const express = require('express')
const router = express.Router()
var config = require('../config');
const url = config.url

var MongoClient = require('mongodb').MongoClient;

router.post('/', async (req,res) => {
  console.log("Sign up- Add New")
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("sdf_project_ver2");
   var myobj = { user: req.body.user_id, pass: req.body.password,access: req.body.access, email: req.body.email, name: req.body.user_name };
  dbo.collection("login").insertOne(myobj, function(err, res1) {
    if (err)         return res.status(404).json({err});
    db.close();
    return res.status(200).json("1 document inserted");
  });
  });
  
})

router.get('/list', async (req,res) => {
  console.log("Login list")
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("sdf_project_ver2");  
    dbo.collection("login").find({}, { projection: { _id:0}}).toArray(function(err, result) {
    if (err) throw err;
    if(result.length!=0)
      return res.status(200).json(result)  
    else
      return res.status(404).json({msg: "No records found for this Query"});
  });
  });
  
})
module.exports = router

router.post('/delete', async (req,res) => {
  console.log("Login delete")
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("sdf_project_ver2");  
    var myquery = {  user:req.body.user};
    dbo.collection("login").deleteOne(myquery, function(err, obj) {
      if(obj.deletedCount==0)     
      return res.json("No document deleted")
      else
      {
      return res.json("1 record deleted")}
  });
  })
})

router.post('/edit', async (req,res) => {
  console.log("Login edit")
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("sdf_project_ver2");  
    var myquery = {user:req.body.user};
    var newvalues = { $set: {user: req.body.user, access:req.body.access, pass: req.body.pass, email:req.body.email, name:req.body.name} };
    dbo.collection("login").updateOne(myquery, newvalues, function(err, res1) {
      if (err) throw err;
      if(res1.matchedCount==0)
     { return res.json("No such record");}
     else
     { 
      return res.json("1 document updated");}
    });
  })
})
module.exports = router