const express = require('express')
const router = express.Router()
var config = require('../config');
const url = config.url
var request = require("request");
var MongoClient = require('mongodb').MongoClient;
// const axios=require('axios')
const smallbox = require('../models/CO_smallbox.js')
const printerip = config.printerip
const getISTTime = () => {
    let d = new Date()
    return d.getTime() + ( 5.5 * 60 * 60 * 1000 )
  }


router.post('/post', async (req,res100) => {
  console.log("CO-pouch-post")
  var mypromise100=new Promise((resolve100,reject100)=>{
  MongoClient.connect(url, async function(err, db) {
    if (err) throw err;
    var dbo = db.db("sdf_project_ver2");
    var myquery={pno: req.body.PartNumber}
    dbo.collection("sap_cos").find(myquery,{ projection: { _id:0}}).toArray(async function(err, result) {
            if (err) throw err;
            if(result.length!=0)
             {  let k10009090= (parseInt(result[0].remaining)- (+req.body.Quantity)).toString()
                var newvalues = { $set: { remaining:k10009090} };
                dbo.collection("sap_cos").updateOne(myquery,newvalues,function(err, result123) {
                  if(result123.length!=0)
                  {
                    console.log('editted '+newvalues)
                  }
                })
                resolve100(1)
             }
            else

           {
           return res100.json("Part number not in SAP. Box not saved")}
            })
        })   
      })   
    var k10001=await mypromise100
    let myPromise = new Promise(async function(myResolve, myReject) {
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
            dbo.collection("Smallboxid").find({},{ projection: { _id:0,idno:0}}).toArray(async function(err, result) {
              if (err) throw err;
              if(result.length!=0)
               {             
                if(result[0]['BoxNo'].includes(month+year)==true)
                    {   var krish=result[0]['BoxNo'].split(month_year)
                        myResolve(parseInt(krish[0]))
                    }
                else
                {
                myResolve(0)}
               }
                  
            else
            {myResolve(-1)}
        })
        })})
   
        let t= await d101
        if(t!=-1)
        {  
           MongoClient.connect(url, async function(err, db) {
                if (err) throw err;
                var dbo = db.db("sdf_project_ver2");
                var myquery={idno: "1"}
                var newvalues = { $set: {idno: "1" , BoxNo:   t+1+month+year } };
                  let d51 =new Promise(async function(myResolve, myReject){   dbo.collection("Smallboxid").updateOne(myquery, newvalues,async function(err, res) {
                    if (err) throw err;
                    myResolve(1)
                    db.close();
                  });})
            let d=await d51
            myResolve(t+1+month+year)
  
        })}
        else
        {
            MongoClient.connect(url, async function(err, db) {
            if (err) throw err;
            var dbo = db.db("sdf_project_ver2");
            var myobj ={idno: "1" , BoxNo:  1+month+year }
            dbo.collection("Smallboxid").insertOne(myobj, function(err, res1) {
              if (err) throw err;
              myResolve(1+month+year)
              
             })
            })
        }

      })


var options = { 
  method: 'POST',
  url: printerip+'/pouch',
  headers: 
   { 
     'content-type': 'application/x-www-form-urlencoded' },
  form: 
   { PartNo: req.body.PartNumber,
     PackingType: 'CO-Pouch',
     Weight:parseInt(req.body.WEIGHT_UNIT)*(+req.body.Quantity),
     PackedBy: req.body.Operator,
     qrcode: await myPromise,
     Quantity: req.body.Quantity,
     PouchNo:await myPromise,
     PartDesc: req.body.Name_desc                                     
   } 
  };


  //  request(options, function (error, response, body) {
  //   if (error) console.log( error)
  // });
        

    const Trans = new smallbox({
        Datenow:getISTTime(),
        packageType: 'CO',
        Name_desc:req.body.Name_desc,
        PartNumber:req.body.PartNumber,
        WEIGHT_UNIT:req.body.WEIGHT_UNIT, 
        Quantity:req.body.Quantity, 
        PO_Quantity:req.body.PO_Quantity, 
        SmallBox_Label:await myPromise,
        Remarks:req.body.Remarks,
        GrossWeight:req.body.GrossWeight,
        Operator: req.body.Operator
      })

      const a1 =  await Trans.save()
      return res100.json('Generated Boxid - '+await myPromise)

})


router.post('/confirmSmallbox', async (req,res) => {
    console.log("CO-pouch-confirmSmallbox")
    MongoClient.connect(url, async function(err, db) {
        if (err) throw err;
        var dbo = db.db("sdf_project_ver2");
        var myquery={"SmallBox_Label":req.body.SmallBox_Label}
        dbo.collection("co_smallboxes").find(myquery,{ projection: { _id:0}}).toArray(async function(err, result) {
            if (err) throw err;
            if(result.length!=0)
            {                     
              return res.json(result[0])
            }
            else   
              return res.json("No data")
            })
        })   
})


router.get('/Pouchtable', async (req,res) => {
  console.log("CO-pouch-Table")
  MongoClient.connect(url, async function(err, db) {
    if (err) throw err;
    var dbo = db.db("sdf_project_ver2");
    var date=new Date()
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    var start=new Date(year,month,day);
    var end=  new Date(year,month,day+1);
    var query={}
    query.Datenow={
            "$gte": start,
            "$lt": end
          }
          dbo.collection("co_smallboxes").find(query,{ projection: { _id:0,__v:0,packageType:0,Operator:0,PO_Quantity:0}}).sort({Datenow:-1}).toArray(async function(err, result) {
        if (err) throw err;
        if(result.length!=0)
         {     
            result.map((itm,index)=>{
              let newdt= itm.Datenow.toISOString().split('T')
              itm.Datenow=newdt[0]
              return itm
               })
                return res.json(result)
           
         }
        else
         return res.json("No data")
        })
    })   
})
module.exports = router