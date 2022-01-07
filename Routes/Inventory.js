const express=require('express')
const router=express.Router()
var config = require('../config');
const url = config.url
var MongoClient = require('mongodb').MongoClient;

router.post('/table',(req,res)=>{
    console.log('Inventory table')
    MongoClient.connect(url,(err,db)=>{
        var dbo=db.db('sdf_project_ver2');var query={}
        if(req.body.material!='')
        {
            query.material=req.body.material.trim('')
        }
        dbo.collection("sap_weight_trans1").find(query,{ projection: { _id:0,__v:0}}).toArray(async function(err, result) {
            if(result.length!=0)
             {     
                                   return res.json(result)     
             }  
         })
        })
})

router.delete('/',(req,res)=>{
    console.log('Inventory delete material '+req.body.material)
    MongoClient.connect(url,(err,db)=>{
        var dbo=db.db('sdf_project_ver2');var query={}
        if(req.body.material!='')
        {
            query.material=req.body.material
        }
        dbo.collection("sap_weight_trans1").deleteOne(query,function(err, obj) {
            if(obj.deletedCount==1)
             {     
                console.log('Deleted')     
                res.json('Deleted')
             }  
         })
    })
})
router.post('/table-edit',(req,res321)=>{
    console.log('Inventory edit material '+req.body.material)
    MongoClient.connect(url,(err,db)=>{
        var dbo=db.db('sdf_project_ver2');var query={}
        req.body.material!=''? query.material=req.body.material:''
        var newvalues = { $set: {material: req.body.material, desc: req.body.desc, dimension:req.body.dimension, uom: req.body.uom, noofpieces: req.body.noofpieces, gross:req.body.gross, net: req.body.net, tare: req.body.tare, packing_type:req.body.packing_type, commodity:req.body.commodity , remarks:req.body.remarks  } };
        dbo.collection("sap_weight_trans1").updateOne(query, newvalues, function(err, res32) {
            if(res32.modifiedCount==1)
            return res321.json("Material updated") 
            else 
            return res321.json("Update Error")                         
          })
    })
})


router.post('/table-add', async (req,res321)=>{
    console.log('Inventory add material '+req.body.material)
    if(req.body.material=='' || req.body.material==' ') res321.json("Material Id is manadatory")
    var prom=new Promise((myresolve,reject)=>{
        MongoClient.connect(url, function(err, db) {
                var dbo = db.db("sdf_project_ver2");
                var query21={"material":req.body.material}
                dbo.collection("sap_weight_trans1").find(query21).toArray(async function(err, result) {
                    if(result.length!=0)
                     {     
                        return res321.json("Material Id already exists") 
                     }  
                     else
                     myresolve(1)
                 })
        })
    })
    let k=await prom
    MongoClient.connect(url,(err,db)=>{
        var dbo=db.db('sdf_project_ver2');var query={};
        var newvalues = {material: req.body.material, desc: req.body.desc, dimension:req.body.dimension, uom: req.body.uom, noofpieces: req.body.noofpieces, gross:req.body.gross, net: req.body.net, tare: req.body.tare, packing_type:req.body.packing_type, commodity:req.body.commodity , remarks:req.body.remarks  } 
        dbo.collection("sap_weight_trans1").insertOne(newvalues, function(err, res32) {
            if (err) throw err;
            if(res32.acknowledged==true)
            res321.json("Data Added Successfully") 
            db.close();
          });
    })

})
module.exports = router
