const express = require('express')
const router = express.Router()
var config = require('../config');
const url = config.url
var MongoClient = require('mongodb').MongoClient;
const boxlist1 = require('../models/boxlist')


router.get('/fetch', async(req,res) => {
    MongoClient.connect(url, async function(err, db) {
        if (err) throw err;
        var dbo = db.db("sdf_project_ver2");
        dbo.collection("boxlists").find({},{ projection: { _id:0,idno:0}}).toArray(async function(err, result) {
          if (err) throw err;
          if(result.length!=0)
           {   return res.json(result)          
           }
        else
        {return res.json("NO data")}
    })
})
})

router.post('/edit', async(req,res) => {
  console.log('boxlist edit')
  MongoClient.connect(url, async function(err, db) {
      if (err) throw err;
      var dbo = db.db("sdf_project_ver2");
      var myquery={Sizelist: req.body.Sizelist}
      var newvalues = { $set: {Sizelist: req.body.Sizelist , Length:  req.body.Length , Breadth: req.body.Breadth , Height:  req.body.Height , Tare_Weight: req.body.Tare_Weight } };

      dbo.collection("boxlists").updateOne(myquery, newvalues,async function(err, res1) {
                    if (err) throw err;
                    console.log("1 document updated");
                    db.close();
                    return res.json("Editted")
                  })
      
  })
})

router.post('/add', async(req,res) => {
  console.log('boxlist add')

  let d100=new Promise(function(myResolve, myReject) {MongoClient.connect(url, async function(err, db) {
    if (err) throw err;
    var dbo = db.db("sdf_project_ver2");
    let query={Sizelist: req.body.Sizelist.toUpperCase()}
    dbo.collection("boxlists").find(query).toArray(async function(err, result) {
        if (err) throw err;
        if(result.length==0)
         {    
            myResolve(1)
         }
        else
         return res.json("Repeated Sizelist Name")
        })
    })   

})
let d1= await d100

if(d1==1)
 { const BOX = new boxlist1({
    Sizelist: req.body.Sizelist,
    Length:req.body.Length,
    Breadth:req.body.Breadth, 
    Height:req.body.Height, 
    Tare_Weight:req.body.Tare_Weight    
  })

  const a1 =  await BOX.save()
  return res.json('Data saved')}
})

router.post('/delete', async(req,res) => {
  console.log('boxlist delete')

    MongoClient.connect(url, async function(err, db) {
        if (err) throw err;
        var dbo = db.db("sdf_project_ver2");
        var myquery = { Sizelist: req.body.Sizelist };
  dbo.collection("boxlists").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    db.close();
    return res.json("1 document deleted");
  });
    })

})
module.exports = router
