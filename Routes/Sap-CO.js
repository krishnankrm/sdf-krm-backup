const express=require('express')
const router=express.Router()
var config = require('../config');
const url = config.url
var MongoClient = require('mongodb').MongoClient;
const CO_SAp = require('../models/SAP_CO.js')
const CO_Trans = require('../models/Sap_trans.js')
const CO_Weight = require('../models/Sap_input_wieght.js')

const getISTTime = () => {
    let d = new Date()
    return d.getTime() + ( 5.5 * 60 * 60 * 1000 )
  }


router.post('/CO', async (req,res) => {
    console.log("CO SAP")
    var count=0
    var k=new Promise(function(resolve,reject){
        MongoClient.connect(url, function(err, db) {
        var query={}
        var dbo = db.db("sdf_project_ver2");
        query.Transport=req.body.Transport
        dbo.collection("sap_cos").deleteMany(query, function(err, obj) {
          if (err) throw err;
          db.close()
          resolve(1)
        });
      });
    })
    var k1= await k
    
    var k2=new Promise(function(resolve,reject){
    MongoClient.connect(url, function(err, db) {
          var dbo = db.db("sdf_project_ver2");
          dbo.collection("sap_cos").find({}).toArray(function(err, result) {
            resolve( result)
          })
    })
  })
  var previousdb=await k2
  if(previousdb.length==0)
  {   req.body.material.every(async function(element, index)  {  
      const Trans = new CO_SAp({
                  Datenow:getISTTime(), 
                  pno:req.body.material[index],
                  desc:req.body.material_description[index],
                  Supplier:req.body.supplier_name[index], 
                  Admin:req.body.admin_name[index], 
                  total:req.body.total[index],
                  remaining:req.body.total[index],
                  remaining1:req.body.total[index],
                  Transport:req.body.Transport
        })

        const a1 =  await Trans.save()       
      })
      res.json('Data added successfully')
      }
      else
      { 
        for(let i=0;i<req.body.material.length;i++)
        { loop:
          for(let j=0;j<previousdb.length;j++)
          {
            if(previousdb[j].pno==req.body.material[i])
            { count+=1
              console.log('10')
              const filter = { pno: previousdb[j].pno };
              var update={
                              Datenow:getISTTime(), 
                              pno:req.body.material[i],
                              desc:req.body.material_description[i],
                              Supplier:req.body.supplier_name[i], 
                              Admin:req.body.admin_name[i], 
                              total:parseInt(req.body.total[i]) + parseInt(previousdb[j].total),
                              remaining:parseInt(req.body.total[i]) + parseInt(previousdb[j].remaining),
                              remaining1:parseInt(req.body.total[i]) + parseInt(previousdb[j].remaining1),
                              Transport:req.body.Transport
                            }
              let doc = await CO_SAp.findOneAndUpdate(filter, update, {
                returnOriginal: false
              });
              break loop;
            }
              if(j==previousdb.length-1)
              {
                const Trans = new CO_SAp({
                Datenow:getISTTime(), 
                pno:req.body.material[i],
                desc:req.body.material_description[i],
                Supplier:req.body.supplier_name[i], 
                Admin:req.body.admin_name[i], 
                total:req.body.total[i],
                remaining:req.body.total[i],
                remaining1:req.body.total[i],
                Transport:req.body.Transport
              })
              const a1 =  await Trans.save()                
              }
           
          }
        }
      }
  //   MongoClient.connect(url, function(err, db) {
  //     var dbo = db.db("sdf_project_ver2");
  //     dbo.collection("sap_cos").find({}).toArray(function(err, result) {
  //       if(result.length!=0)
  //       {
  //         result.forEach((element,index) => {
  //           flag=0
  //           req.body.material.every(async function(reqelement, index12)  {  
  //           if(element.pno==req.body.material[index12])
  //           { flag=1
  //              const Trans = new CO_SAp({
  //               Datenow:getISTTime(), 
  //               pno:req.body.material[index12],
  //               desc:req.body.material_description[index12],
  //               Supplier:req.body.supplier_name[index12], 
  //               Admin:req.body.admin_name[index12], 
  //               total:parseInt(req.body.total[index12]) + parseInt(element.total),
  //               remaining:parseInt(req.body.total[index12]) + parseInt(element.remaining),
  //               remaining1:parseInt(req.body.total[index12]) + parseInt(element.remaining1),
  //               Transport:req.body.Transport
  //             })
  //             f++;

  //             const a1 =  await Trans.save()   
  //             res.json('Data added successfully')
  //           }

  //         });
  //       })}
  //       else
  //      { 
  //        req.body.material.every(async function(element, index)  {  
  //         const Trans = new CO_SAp({
  //             Datenow:getISTTime(), 
  //             pno:req.body.material[index],
  //             desc:req.body.material_description[index],
  //             Supplier:req.body.supplier_name[index], 
  //             Admin:req.body.admin_name[index], 
  //             total:req.body.total[index],
  //             remaining:req.body.total[index],
  //             remaining1:req.body.total[index],
  //             Transport:req.body.Transport
  //           })
  //           f++;
  //           const a1 =  await Trans.save()   
  //           res.json('Data added successfully')
  //         })
  //     }

  //   })
  //  })

    setTimeout(() => {
      console.log('count',count)
    }, 3000);
 })


 router.post('/CO-check', async (req,mainres) => {
    console.log("CO SAP check by part number")
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("sdf_project_ver2");
        var query={"pno":req.body.pno}
        dbo.collection("sap_cos").find(query,{ projection: { _id:0,pno:0,__v:0,Datenow:0,Supplier:0,total:0}}).toArray(async function(err, result) {
            if (err) throw err;
            if(result.length!=0)
            {   
                mainres.json(result[0])
            }
            else
            {   
                console.log("Invalid Pno")
                 mainres.json("Invalid Pno")
            }
      });
    });
    
 })

 router.post('/trans', async (req,res) => {
  console.log("SAP Transmission")
  var k=new Promise(function(resolve,reject){
      MongoClient.connect(url, function(err, db) {
      var dbo = db.db("sdf_project_ver2");
      dbo.collection("sap_trans").drop(function(err, delOK) {
        if (err) resolve(err);
        if (delOK) {console.log("Collection deleted"); resolve(1)}
        db.close();
      });
    });
  })
  var k1= await k
  req.body.Material.every(async function(element, index)  {  
      const Trans = new CO_Trans({
          material:req.body.Material[index],
          desc:req.body.Material_description[index],
          type:req.body.Commidity[index], 
          total:req.body.Total[index],
          remaining:+(req.body.Total[index]),
          Transport:req.body.Transport
        })
        const a1 =  await Trans.save()
  });       
  return res.json('File uploaded successfully')
})



router.post('/weight-trans', async (req,res) => {
  console.log("SAP Transmission Weight")
  var k=new Promise(function(resolve,reject){
      MongoClient.connect(url, function(err, db) {
      var dbo = db.db("sdf_project_ver2");
      dbo.collection("sap_weight_trans1").drop(function(err, delOK) {
        if (err) resolve(err);
        if (delOK) {console.log("Collection deleted"); resolve(1)}
        db.close();
      });
    });
  })
  var k1= await k
  req.body.Material.every(async function(element, index)  {  
      const Trans = new CO_Weight({
          material:req.body.Material[index],
          desc:req.body.Material_description[index],
          dimension:req.body.dimension[index],
          uom:req.body.uom[index],
          noofpieces:req.body.noofpieces[index], 
          gross:req.body.gross[index],
          net:req.body.net[index],
          tare:req.body.tare[index],
          packing_type:req.body.packing_type[index],
          commodity:req.body.commodity[index],
          remarks:req.body.remarks[index], 
        })
        const a1 =  await Trans.save()
  });       
  return res.json('File uploaded successfully')
})

router.post('/CO-make_parts-weight', async (req,mainres) => {
  console.log("CO SAP make_parts weight")
  MongoClient.connect(url, function(err, db) {
      var dbo = db.db("sdf_project_ver2");
      if(req.body.commodity!='OTHER_PARTS')
      var query={"material":req.body.material,"commodity":req.body.commodity}
      else
      var query={"material":req.body.material,"commodity":{ $nin: ["TRANSMISSION",'ENGINE'] }}
      dbo.collection("sap_weight_trans1").find(query,{ projection: { _id:0,gross:1,tare:1,}}).toArray(async function(err, result) {
          if (err) throw err;
          if(result.length!=0)
          {   
              mainres.json(result[0])
          }
          else
          {   
              mainres.json("Invalid Pno")
          }
    });
  });
})
module.exports = router;
