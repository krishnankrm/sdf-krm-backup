const express = require('express')
const router = express.Router()
var config = require('../config');
const url = config.url
var MongoClient = require('mongodb').MongoClient;
const bigbox = require('../models/CO_bigbox.js')

var request = require("request");
var printerip= config.printerip
const getISTTime = () => {
    let d = new Date()
    return d.getTime() + ( 5.5 * 60 * 60 * 1000 )
  }


router.post('/post', async (req,res) => {
    console.log("CO-Bigbox-post")
    var partnumberarray=[]
    let prom = new Promise(async function(myResolve, myReject) {
      MongoClient.connect(url, async function(err, db) {
        if (err) throw err;
        var dbo = db.db("sdf_project_ver2");
        var a=[];               
        req.body.SmallBox_Label.forEach((item,index) => {
            a.push({"Smallbox1_Label":item})
        })
        var query21={$or:a}
        dbo.collection("co_smallbox1").find(query21,{ projection: {_id:0,PartNumber:1,Quantity:1}}).sort({Datenow:-1}).toArray(async function(err, result) {  
            result.forEach((element,index) => {
            element.PartNumber.forEach((element1,index10) => {
            partnumberarray.push({"Pn":element1,"count":parseInt(element.Quantity[index10])})
            })
            if(index==result.length-1)
            {
              myResolve(1)
            }
          }); 
        })
     })
  })


    let k2314= await prom

    let prom5463 = new Promise(async function(myresolve145, myReject) {

    for(i=0;i<partnumberarray.length;i++)
    {
      for(j=i+1;j<partnumberarray.length;j++)
      {  
        if(partnumberarray[i].Pn==partnumberarray[j].Pn)
        { 
         console.log(i,j)

          partnumberarray[i].count=partnumberarray[i].count + partnumberarray[j].count
          partnumberarray.splice(j, 1);
          j=i+1 
        }
      }
      if(i==partnumberarray.length-1)
      {       
          myresolve145(0)
      }
    }
  })
  d456=await prom5463
  var a312=[]
      partnumberarray.forEach(element => {
      a312.push({"pno":element['Pn'],"remaining1":{$gte: element['count']-1}})
     });
            
            var query211={$or:a312}

  let myPromise321321 = new Promise(async function(myResolve32143, myReject) {
    MongoClient.connect(url, function(err, db) {
      var dbo = db.db("sdf_project_ver2");
      dbo.collection("sap_cos").find(query211,{ projection: { _id:0,__v:0}}).toArray(async function(err11, result11) {
        if (err11) throw err11;
  
         if(result11.length==query211['$or'].length)
         {
           for(i=0;i<result11.length;i++)
           {

             for(let t=0;t<partnumberarray.length;t++)
           {
             if(result11[i].pno==partnumberarray[t].Pn)
            { 
              var newquery={"pno":partnumberarray[t]['Pn']}
              var newvalues = { $set: {remaining1: +(result11[i].remaining1)-partnumberarray[t]['count'] } };      
            dbo.collection("sap_cos").updateOne(newquery, newvalues, function(err, res321) {
            if (err) throw err;
            console.log("1 document updated");                  
            });
           
          }
          if(i==result11.length-1)
          myResolve32143(1)
        }
           }
          
         }
         else
         {   
           res.json("P/N not available in PO for the required quantity")
         }               
  });
});
  })
  let d1= await (myPromise321321)

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
            dbo.collection("Boxes").find({},{ projection: { _id:0,idno:0}}).toArray(async function(err, result) {
              if (err) throw err;
              if(result.length!=0)
               {             
                  if(result[0]['BoxNo'].includes(month+year)==true)
                      {   var krish=result[0]['BoxNo'].split(month_year)
                          myResolve(parseInt(krish[0]))
                      }
                  else
                  {
                    myResolve(0)
                  }
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
                    let d51 =new Promise(async function(myResolve, myReject){   dbo.collection("Boxes").updateOne(myquery, newvalues,async function(err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
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
            dbo.collection("Boxes").insertOne(myobj, function(err, res1) {
              if (err) throw err;
              myResolve(1+month+year)
             })
            })
        }
      })

    const Trans = new bigbox({
        Datenow:getISTTime(),
        packageType: 'CO',
        SmallBox_Label:req.body.SmallBox_Label, 
        Transport:req.body.Transport,
        GrossWeight:req.body.GrossWeight,
        BigBox_Label: await myPromise,
        Box_Type:req.body.Box_Type,
        length:req.body.length,
        breadth:req.body.breadth,
        height:req.body.height,
        Tareweight:req.body.Tareweight,
        Netweightofsb:req.body.Netweightofsb,
        Calculatedweight:req.body.Calculatedweight,
        Operator:req.body.Operator
      })

      // var printerjson={
      //   "Tot_weight" : req.body.Netweight,
      //   "PartName" : 'CO-BigBox',
      //   "Quantity": req.body.Quantity, 
      //   "LotNo" : 'lot1',
      //   "BoxNo" :await myPromise,
      //   "PackedBy": "Krishnan",
      //   "qrcode": await myPromise,
      //   }
        // axios.post(printerip+'/bigbox',printerjson)
        //   .then(function (response) {
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //   });
        var options = { method: 'POST',
        url: printerip+'/bigbox',
        headers: 
         { 
           'content-type': 'application/x-www-form-urlencoded' },
        form: 
         {
          Weight : req.body.Calculatedweight,//
          PackingType : 'CO-BigBox',//
          Quantity: req.body.SmallBox_Label.length, //
          BatchNo: 'lot1',//
          BoxNo :await myPromise,//
          PackedBy: req.body.Operator,//
          qrcode: await myPromise,//         
          WONumber: 'lot1',//
         } 
        };
      
        //  request(options, function (error, response, body) {
        //   if (error) console.log( error)
        // });
      const a1 =  await Trans.save()
      return res.json('Generated Boxid - '+await myPromise)

})



router.post('/bigboxscan', async (req,res) => {
    console.log("CO-Bigbox-scan")
    var k=[]
    MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("sdf_project_ver2");
          var myquery={Smallbox1_Label:req.body.Smallbox1_Label}
          dbo.collection("co_smallbox1").find(myquery,{ projection: { _id:0, Netweight:1, Operator:1, PartNumber:1}}).toArray(function(err, result) {
            if (err) throw err;
            if(typeof result[0]!='undefined')
              {
                k=result.map((element,index)=>{
                  //element.Datenow=element.Datenow.slice(0,8)
                   element.partnolength=element.PartNumber.length
                   delete element["PartNumber"]; 
                  return element
                  })
                res.json(k[0])
        
              }
            else
           return res.json('No data')
            db.close();
          })
          
        });

    // var Smallboxarraylist=[],returnarray=[] ,returnarray_afterpromise=[]   
    // let myPromise = new Promise(async function(myResolve, myReject) { MongoClient.connect(url, function(err, db) {
    //     if (err) throw err;
    //     var dbo = db.db("sdf_project_ver2");
    //     var myquery={BigBox_Label:req.body.BigBox_Label}
    //     dbo.collection("co_bigboxes").find(myquery).toArray(function(err, result) {
    //       if (err) throw err;
    //       if(typeof result[0]!='undefined')
    //       myResolve(result[0].SmallBox_Label)
    //       else
    //      return res.json('No data available')
    //       db.close();
    //     })
        
    //   });
    // })

    // Smallboxarraylist=await myPromise
    // let myPromise1 = new Promise(async function(myResolve, myReject) { 
    //     MongoClient.connect(url, function(err, db) {
    //         Smallboxarraylist.forEach((item,index) => {

    //         if (err) throw err;
    //         var dbo = db.db("sdf_project_ver2");
    //         var myquery={SmallBox_Label:item}
    //         dbo.collection("co_smallboxes").find(myquery,{ projection: { _id:0,__v:0}}).toArray(function(err, result) {
    //           if (err) throw err;
    //           if(typeof result[0]!='undefined')
    //           returnarray.push(result[0])
    //           else
    //           console.log('No result')
    //           if(returnarray.length==Smallboxarraylist.length)
    //         myResolve(returnarray)

    //         })

    //     })         
    // });

  
// })
// returnarray_afterpromise=await myPromise1

// returnarray_afterpromise.map((element,index)=>{

//     let newdt= element.Datenow.toISOString().split('T')
//     element.Datenow=newdt[0].split('-')[2]+'-'+newdt[0].split('-')[1]+'-'+newdt[0].split('-')[0],
//     element.Description=' '
//     element.Unitofmeasure='KGS'
//     element.TotalWeight=parseInt(element.Quantity)*parseInt(element.WEIGHT_UNIT).toString()
// })
// return res.json(returnarray_afterpromise)

  
})



router.get('/table', async (req,res) => {
  console.log("bigbox-table")
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
      dbo.collection("co_bigboxes").find(query,{ projection: { __v: 0, _id:0,length:0,breadth:0,height:0,Tareweight:0,packageType:0,GrossWeight:0,}}).sort({Datenow:-1}).toArray(async function(err, result) {
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
           return res.json("No data")
          })
      })   
})


// router.post('/slippost', async (req,res) => {
//     console.log("CO-Bigboxslip-post")
//     const Trans = new bigboxpayslip({
//         Bigboxlabel:req.body.Bigboxlabel, 
//         GrossWeight:req.body.GrossWeight,
//         Box_Type: req.body.Box_Type,
//         Box_Name:req.body.Box_Name,
//         lenght:req.body.lenght, 
//         breadth:req.body.breadth, 
//         height:req.body.height,
//         Boxweight:req.body.Boxweight,
//         Netweight:req.body.Netweight
//       })

//       const a1 =  await Trans.save()
//       return res.json('Data added successfully')
// })

// router.post('/bigboxpackingslip', async (req,res) => {
//   console.log("CO-Bigbox-packingslip")

// let myPromise2 = new Promise(async function(myResolve, myReject) { 
//   MongoClient.connect(url, function(err, db) {

//       if (err) throw err;
//       var dbo = db.db("sdf_project_ver2");
//       var myquery={Bigboxlabel:req.body.BigBox_Label}
//        dbo.collection("bigboxslips").find(myquery,{ projection: { _id:0,__v:0}}).toArray(function(err, result) {
//         if (err) throw err;
//         if(typeof result[0]!='undefined')
//         myResolve(result[0])
//         else
//         return res.json('No result')
//       })      
// })
// })

// return res.json(await myPromise2)

// })
module.exports = router