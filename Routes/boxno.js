const express = require('express')
const router = express.Router()
var config = require('../config');
const url = config.url
var MongoClient = require('mongodb').MongoClient;

router.get('/', async(req,res) => {
    console.log("boxnocheck")
    var d = new Date();
    let year= d.getFullYear()-2000
    let month= d.getMonth()
    switch (month+1)
    {case 1: month='TJAN'; break;
    case 2: month='TFEB'; break;
    case 3: month='TMAR'; break;
    case 4: month='TAPR'; break;
    case 5: month='TMAY'; break;
    case 6: month='TJUN'; break;
    case 7: month='TJUL'; break;
    case 8: month='TAUG'; break;
    case 9: month='TSEP'; break;
    case 10: month='TOCT'; break;
    case 11: month='TNOV'; break;
    case 12: month='TDEC'; break;}
var month_year= month+year
    let d101=new Promise(async function(myResolve, myReject) {MongoClient.connect(url, async function(err, db) {
        if (err) throw err;
        var dbo = db.db("sdf_project_ver2");
        dbo.collection("Boxes").find({},{ projection: { _id:0,idno:0}}).toArray(async function(err, result) {
          if (err) throw err;
          if(result.length!=0)
           {             
            if(result[0]['BoxNo'].includes(month+year)==true)
                {   var krish=result[0]['BoxNo'].split(month_year)
                    myResolve(parseInt(krish[0]))
                }
            else
            myResolve(0)
           }
              
        else
        {myResolve(-1)}
    })
    })})

    let t= await d101
    if(t!=-1)
    {  
          return res.json((t+1)+month+year)
    }
    else
    {
        MongoClient.connect(url, async function(err, db) {
        if (err) throw err;
        var dbo = db.db("sdf_project_ver2");
        var myobj ={idno: "1" , BoxNo:  1+month+year }
        dbo.collection("Boxes").insertOne(myobj, function(err, res1) {
          if (err) throw err;
          return res.json(myobj.BoxNo)
         })
        })
    }

})

module.exports = router;
