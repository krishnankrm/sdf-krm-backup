const express = require('express')
const router = express.Router()
var config = require('../config');
const url = config.url
const printerip = config.printerip
var request = require("request");

var MongoClient = require('mongodb').MongoClient;
const res = require('express/lib/response');

router.post('/', async (req,res100) => {
    console.log("Remaining items in po api call")
    var query={};
    if(req.body.type!='CO' && req.body.type!='All_pages')
    {if(req.body.type=='engine')
    {     query.type="ENGINE"    }
    else if(req.body.type=='transmission')
    {     query.type="TRANSMISSION"     }
    else if(req.body.type=='other-parts')
    {     query.type={$nin : ["TRANSMISSION", "ENGINE"]}   }
    if(req.body.material!='')
    {query.material=req.body.material.trim()}
    if(req.body.remaining=='no')
    {query.remaining=0}
    else if(req.body.remaining=='yes')
    {query.remaining={$ne: 0}}

MongoClient.connect(url, function(err, db) {
    var dbo = db.db("sdf_project_ver2");
    dbo.collection("sap_trans").find(query,{ projection: { _id:0,__v:0,type:0}}).toArray(async function(err, result) {
    if (err) throw err;
            if(result.length!=0)
            {     
                res100.json(result)
            }
            else
            {   
                console.log("No data")
                res100.json("No data")
            }
        })
    })}
    else if(req.body.type=='CO')
    {
        if(req.body.material!='')
        {query.pno=req.body.material.trim()}
        if(req.body.remaining=='no')
        {query.remaining1=0}
        else if(req.body.remaining=='yes')
        {query.remaining1={$ne: 0}}
        MongoClient.connect(url, function(err, db) {
            var dbo = db.db("sdf_project_ver2");
            dbo.collection("sap_cos").find(query,{ projection: { _id:0,__v:0,type:0,remaining:0}}).toArray(async function(err, result) {
            if (err) throw err;
                    if(result.length!=0)
                    {    
                        result=result.map((element,index)=>{
                          element["material"]=element.pno
                          element["remaining"]=element.remaining1 //remaining one is the final parts after CO
                           return( element)

                        }) 
                      res100.json(result)
                    }
                    else
                    {   
                        console.log("No data")
                        return res100.json("No data")
                      
                    }
                })
            })
    }
    else if(req.body.type=='All_pages')
        {  
            var output_array=[],flag=0
            var promise=new Promise((myresolve,myreject)=>{
                var query={}
            MongoClient.connect(url, function(err, db) {
                if(req.body.material!='')
                {query.pno=req.body.material.trim()}
                if(req.body.remaining=='no')
                {query.remaining1=0}
                else if(req.body.remaining=='yes')
                {query.remaining1={$ne: 0}}
                var dbo = db.db("sdf_project_ver2");
                    dbo.collection("sap_cos").find(query,{ projection: { _id:0,__v:0,remaining:0}}).toArray(async function(err, result) {
                        if (err) throw err;
                                if(result.length!=0)
                                {    
                                    let k10=result.map((element,index)=>{
                                        element["type"]='CO'
                                      element["material"]=element.pno
                                      element["remaining"]=element.remaining1 //remaining one is the final parts after CO
                                      output_array.push(element)
                                      if(index==result.length-1) myresolve(1)
                                    }) 
                                }
                                else
                                {   
                                    myresolve(0)
                                }
                            })
                        })
                })
               var f1=await promise
               var promise10=new Promise((myresolve,myreject)=>{
            MongoClient.connect(url, function(err, db) {
                    var dbo = db.db("sdf_project_ver2");
                    var query={}
                    if(req.body.type=='engine')
    {     query.type="ENGINE"    }
    else if(req.body.type=='transmission')
    {     query.type="TRANSMISSION"     }
    else if(req.body.type=='other-parts')
    {     query.type={$nin : ["TRANSMISSION", "ENGINE"]}   }
    if(req.body.material!='')
    {query.material=req.body.material.trim()}
    if(req.body.remaining=='no')
    {query.remaining=0}
    else if(req.body.remaining=='yes')
    {query.remaining={$ne: 0}}
                    dbo.collection("sap_trans").find(query,{ projection: { _id:0,__v:0,}}).toArray(async function(err, result) {
                    if (err) throw err;
                            if(result.length!=0)
                            {     let k1=result.map(
                                ((element,index)=>{     output_array.push(element)   ;if(index==result.length-1) myresolve(1)   })
                                )             
                            }
                            else
                            {   
                                myresolve(0)
                            }
                        })
                    }) 
                }) 
                let f2= await promise10
                return res100.json(output_array)               
        } 

})

module.exports = router