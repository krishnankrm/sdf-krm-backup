const express = require('express')
const router = express.Router()
var config = require('../config');
const url = config.url
var MongoClient = require('mongodb').MongoClient;


router.post('/engine', async (req,res) => {
    console.log("Dashboard - Engine")
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("sdf_project_ver2");
        var query={}
        if(req.body.Pno!='')
          query.Pno=req.body.Pno
        if(req.body.BoxNo!='')
          query.BoxNo=req.body.BoxNo
          if(req.body.Start!='' && req.body.Stop!='')
          { 
            var start= new Date(req.body.Start);
            var end= new Date (req.body.Stop)
            end.setDate(end.getDate() + 1);
            query.Datenow={
                  "$gte": start,
                  "$lt": end
                }
          }
        else if(req.body.Start!=''  && req.body.Stop=='')
        {
          var start= new Date(req.body.Start);
          query.Datenow={
                "$gte": start,
              }
        }
        else if(req.body.Start==''  && req.body.Stop!='')
        {
          var end= new Date (req.body.Stop)
          end.setDate(end.getDate() + 1);
          query.Datenow={
                "$lt": end
              }
        }
        dbo.collection("engines").find(query, { projection: { _id:0,__v: 0,packageType:0}}).toArray(function(err, result) {
            if (err) throw err;
            if(result.length!=0)
             {      result.map(itm=>{
                    let newdt= itm.Datenow.toISOString().split('T')
                    itm.Datenow=newdt[0]
                    itm.engineType= itm.engineType+' Cylinder'
                    return itm
                     })
                return res.json(result.reverse())
             }
            else
              return res.status(404).json({msg: "No records found for this Query"});
          });
        });
      })

      router.post('/transmission', async (req,res) => {
        console.log("Dashboard - transmission")
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("sdf_project_ver2");
            var query={}
            if(req.body.StackNo!='')
              query.StackNo=req.body.StackNo
            if(req.body.BoxNo!='')
              query.boxNo=req.body.BoxNo
              if(req.body.Start!='' && req.body.Stop!='')
                  { 
                    var start= new Date(req.body.Start);
                    var end= new Date (req.body.Stop)
                    end.setDate(end.getDate() + 1);
                    query.Datenow={
                          "$gte": start,
                          "$lt": end
                        }
                  }
                else if(req.body.Start!=''  && req.body.Stop=='')
                {
                  var start= new Date(req.body.Start);
                  query.Datenow={
                        "$gte": start,
                      }
                }
                else if(req.body.Start==''  && req.body.Stop!='')
                {
                  var end= new Date (req.body.Stop)
                  end.setDate(end.getDate() + 1);
                  query.Datenow={
                        "$lt": end
                      }
                }
            dbo.collection("transmissions").find(query, { projection: { _id:0,__v: 0,packageType:0}}).toArray(function(err, result) {
                if (err) throw err;
                if(result.length!=0)
                 {      result.map(itm=>{
                        let newdt= itm.Datenow.toISOString().split('T')
                        itm.Datenow=newdt[0]
    
                        return itm
                         })
                    return res.json(result.reverse())
                 }
                else
                  return res.status(404).json({msg: "No records found for this Query"});
              });
            });
          })


  router.post('/otherpart', async (req,res) => {
            console.log("Dashboard - otherparts")
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("sdf_project_ver2");
                var query={}
                if(req.body.BoxNo!='')
                  query.boxNo=req.body.BoxNo
                if(req.body.Start!='' && req.body.Stop!='')
                  { 
                    var start= new Date(req.body.Start);
                    var end= new Date (req.body.Stop)
                    end.setDate(end.getDate() + 1);
                    query.Datenow={
                          "$gte": start,
                          "$lt": end
                        }
                  }
                else if(req.body.Start!=''  && req.body.Stop=='')
                {
                  var start= new Date(req.body.Start);
                  query.Datenow={
                        "$gte": start,
                      }
                }
                else if(req.body.Start==''  && req.body.Stop!='')
                {
                  var end= new Date (req.body.Stop)
                  end.setDate(end.getDate() + 1);
                  query.Datenow={
                        "$lt": end
                      }
                }
                dbo.collection("otherparts").find(query, { projection: { _id:0,__v: 0,packageType:0}}).toArray(function(err, result) {
                    if (err) throw err;
                    if(result.length!=0)
                     {      result.map(itm=>{
                            let newdt= itm.Datenow.toISOString().split('T')
                            itm.Datenow=newdt[0]
        
                            return itm
                             })
                        return res.json(result.reverse())
                     }
                    else
                      return res.status(404).json({msg: "No records found for this Query"});
                  });
                });
      })
      router.post('/pouch', async (req,res) => {
        console.log("Dashboard - Pouch")
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("sdf_project_ver2");
            var query={}
            if(req.body.BoxNo!='')
              query.SmallBox_Label=req.body.BoxNo
            if(req.body.partno!='')
              query.PartNumber=req.body.partno
            if(req.body.Start!='' && req.body.Stop!='')
              { 
                var start= new Date(req.body.Start);
                var end= new Date (req.body.Stop)
                end.setDate(end.getDate() + 1);
                query.Datenow={
                      "$gte": start,
                      "$lt": end
                    }
              }
            else if(req.body.Start!=''  && req.body.Stop=='')
            {
              var start= new Date(req.body.Start);
              query.Datenow={
                    "$gte": start,
                  }
            }
            else if(req.body.Start==''  && req.body.Stop!='')
            {
              var end= new Date (req.body.Stop)
              end.setDate(end.getDate() + 1);
              query.Datenow={
                    "$lt": end
                  }
            }
            
            dbo.collection("co_smallboxes").find(query, { projection: { __v: 0, _id:0,length:0,breadth:0,height:0,Tareweight:0,packageType:0,GrossWeight:0,}}).sort({Datenow:-1}).toArray(function(err, result) {
                if (err) throw err;
                if(result.length!=0)
                 {      result.map(itm=>{
                        let newdt= itm.Datenow.toISOString().split('T')
                        itm.Datenow=newdt[0]
                        return itm
                         })
                    return res.json(result)
                 }
                else
                  return res.status(404).json({msg: "No records found for this Query"});
              });
            });
  })

      router.post('/bigbox', async (req,res) => {
        console.log("Dashboard - bigbox")
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("sdf_project_ver2");
            var query={}
            if(req.body.BoxNo!='')
              query.BigBox_Label=req.body.BoxNo
            if(req.body.Start!='' && req.body.Stop!='')
              { 
                var start= new Date(req.body.Start);
                var end= new Date (req.body.Stop)
                end.setDate(end.getDate() + 1);
                query.Datenow={
                      "$gte": start,
                      "$lt": end
                    }
              }
            else if(req.body.Start!=''  && req.body.Stop=='')
            {
              var start= new Date(req.body.Start);
              query.Datenow={
                    "$gte": start,
                  }
            }
            else if(req.body.Start==''  && req.body.Stop!='')
            {
              var end= new Date (req.body.Stop)
              end.setDate(end.getDate() + 1);
              query.Datenow={
                    "$lt": end
                  }
            }
            
            dbo.collection("co_bigboxes").find(query, { projection: { __v: 0, _id:0,length:0,breadth:0,height:0,Tareweight:0,packageType:0,GrossWeight:0,}}).sort({Datenow:-1}).toArray(function(err, result) {
                if (err) throw err;
                if(result.length!=0)
                 {      result.map(itm=>{
                        let newdt= itm.Datenow.toISOString().split('T')
                        itm.Datenow=newdt[0]
    
                        return itm
                         })
                    return res.json(result)
                 }
                else
                  return res.status(404).json({msg: "No records found for this Query"});
              });
            });
  })

router.post('/smallbox', async (req,res) => {
    console.log("Dashboard - smallbox")
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("sdf_project_ver2");
        var query={}
        if(req.body.BoxNo!='')
          query.Smallbox1_Label=req.body.BoxNo
        if(req.body.Start!='' && req.body.Stop!='')
          { 
            var start= new Date(req.body.Start);
            var end= new Date (req.body.Stop)
            end.setDate(end.getDate() + 1);

            query.Datenow={
                  "$gte": start,
                  "$lt": end
                }
          }
        else if(req.body.Start!=''  && req.body.Stop=='')
        {
          var start= new Date(req.body.Start);
          query.Datenow={
                "$gte": start,
              }
        }
        else if(req.body.Start==''  && req.body.Stop!='')
        {
          var end= new Date (req.body.Stop)
          end.setDate(end.getDate() + 1);
          query.Datenow={
                "$lt": end
              }
        }
        dbo.collection("co_smallbox1").find(query, { projection: { _id:0,__v: 0,packageType:0}}).toArray(function(err, result) {
            if (err) throw err;
            if(result.length!=0)
             {      result.map(itm=>{
                    let newdt= itm.Datenow.toISOString().split('T')
                    itm.Datenow=newdt[0]

                    return itm
                     })
                return res.json(result.reverse())
             }
            else
              return res.status(404).json({msg: "No records found for this Query"});
          });
        });
})

module.exports = router
