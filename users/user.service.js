const config = require('../config');
const jwt = require('jsonwebtoken');
const url = config.url
var APisecretkey='THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING'

// users hardcoded for simplicity, store in a db for production applications

var MongoClient = require('mongodb').MongoClient;
const { json } = require('express');

var usersdb=[]


module.exports = {
    authenticate,
};

async function authenticate({ username, password }) {

     let d100=new Promise(async function(myResolve, myReject) {
        MongoClient.connect(url, async function(err, db) {
        MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("sdf_project_ver2");
        dbo.collection("login").find({}).toArray(function(err, result) {
          if (err) throw err;
          usersdb=result;
          myResolve(usersdb)
          db.close();
        });
     });
    })})

     let d= await d100

     const user = usersdb.find(u => u.user === username && u.pass === password);
    
    if (!user)    {console.log("Failure Login")  
    return  ( 'Username or password is incorrect')}

    const token = jwt.sign({ sub: user.id }, APisecretkey, { expiresIn: '7d' });
    console.log("Successful Login")  
    return {
        "token":token,
        "empid":user.name,//empid denotes employee name not id
        "access":user.access
    };
   
    
}



