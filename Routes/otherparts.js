const express = require('express')
const router = express.Router()
var config = require('../config');
const url = config.url
const printerip = config.printerip
var Excel=require('exceljs')
var request = require("request");

// var mongodb= require('mongodb');
var MongoClient = require('mongodb').MongoClient;
const otherparts1 = require('../models/Otherparts')
const getISTTime = () => {
    let d = new Date()
    return d.getTime() + ( 5.5 * 60 * 60 * 1000 )
  }

async function excelOp(array,weightSaparray) {
    let workbook = new Excel.Workbook();
    let SNO=1;
    k=1;
    workbook = await workbook.xlsx.readFile('./ExcelList/Dashboard - other.xlsx'); 
    let worksheet = workbook.getWorksheet('Sheet1');   
    var cellborderStyles = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };

    array.forEach((element,i) => {

        worksheet.mergeCells('L'+(1+SNO)+':L'+(1+SNO+element.PartNumber.length-1));
        worksheet.mergeCells('M'+(1+SNO)+':M'+(1+SNO+element.PartNumber.length-1));
        worksheet.mergeCells('B'+(1+SNO)+':B'+(1+SNO+element.PartNumber.length-1));
        worksheet.mergeCells('N'+(1+SNO)+':O'+(1+SNO+element.PartNumber.length-1));

        element.PartNumber.forEach((element1,j) => {
         
        worksheet.mergeCells('C'+(1+SNO)+':D'+(1+SNO));
        worksheet.mergeCells('E'+(1+SNO)+':G'+(1+SNO));
        worksheet.getColumn(5).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getRow((1+SNO).toString()).getCell('C').value=element1; 
        worksheet.getRow((1+SNO).toString()).getCell('K').value=element.GrossWeight[j]; 
        worksheet.getRow((1+SNO).toString()).getCell('B').border = cellborderStyles
        worksheet.getRow((1+SNO).toString()).getCell('C').border = cellborderStyles
        worksheet.getRow((1+SNO).toString()).getCell('K').border = cellborderStyles
        worksheet.getRow((1+SNO).toString()).getCell('E').border = cellborderStyles
        worksheet.getRow((1+SNO).toString()).getCell('H').border = cellborderStyles
        worksheet.getRow((1+SNO).toString()).getCell('I').border = cellborderStyles
        worksheet.getRow((1+SNO).toString()).getCell('J').border = cellborderStyles
        weightSaparray.forEach((element100,j100) => {
        if(element1==element100.material)
        {
          worksheet.getRow((1+SNO).toString()).getCell('F').value=element100.desc; 
          worksheet.getRow((1+SNO).toString()).getCell('I').value=element100.uom; 
        }
      })
        SNO+=1
        })
        Box_Type=element['Box_Type']
        // if(element['Box_Type']=="Carton Box") Box_Type='C'
        // else if(element['Box_Type']=="Carton Box With Wooden Pallet") Box_Type='CW'
        // else if(element['Box_Type']=="Wooden Box") Box_Type='W'
        // else  Box_Type='M'
        // worksheet.getRow((0+SNO).toString()).getCell('L').value=(+element.Netweight)+(+element.Boxweight); 
        // worksheet.getRow((0+SNO).toString()).getCell('M').value=(+element.Boxweight) 
        worksheet.getRow((0+SNO).toString()).getCell('L').value=(+element.Netweight)
        // worksheet.getRow((0+SNO).toString()).getCell('O').value=element.lenght+'*'+element.breadth+'*'+element.height
        // worksheet.getRow((0+SNO).toString()).getCell('P').value=element.PartNumber.length
        worksheet.getRow((0+SNO).toString()).getCell('M').value=element.boxNo
        // worksheet.getRow((0+SNO).toString()).getCell('R').value=Box_Type
        worksheet.getRow((0+SNO).toString()).getCell('B').value=k; 
        worksheet.getRow((0+SNO).toString()).getCell('N').value=element.Datenow

        k+=1
        // worksheet.getRow((0+SNO).toString()).getCell('L').border = cellborderStyles
        // worksheet.getRow((0+SNO).toString()).getCell('M').border = cellborderStyles
        worksheet.getRow((0+SNO).toString()).getCell('L').border = cellborderStyles
        // worksheet.getRow((0+SNO).toString()).getCell('O').border = cellborderStyles
        // worksheet.getRow((0+SNO).toString()).getCell('P').border = cellborderStyles
        worksheet.getRow((0+SNO).toString()).getCell('M').border = cellborderStyles
        // worksheet.getRow((0+SNO).toString()).getCell('R').border = cellborderStyles      
        // worksheet.getRow((0+SNO).toString()).getCell('R').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getRow((0+SNO).toString()).getCell('N').border = cellborderStyles      
        worksheet.getRow((0+SNO).toString()).getCell('N').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });

    for(let i=1;i<=14;i++){
      worksheet.getColumn(i).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    }    
    return(await workbook);
}

router.post('/post', async (req,res) => {
        console.log("otherparts-post")
        var prom=new Promise((myresolve,reject)=>{

            MongoClient.connect(url, function(err, db) {
                    var dbo = db.db("sdf_project_ver2");
                    var a=[],b=[],c=[];
                    const counts = {};
                    const sampleArray = req.body.PartNumber;
                    sampleArray.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
                    for (var key in counts){
                      a.push({"material":key,"type":{$nin : ["ENGINE", "TRANSMISSION"]},"remaining":{$gte: counts[key]}})
                      b.push(counts[key])
                      c.push(key)
                    }

                    var query21={$or:a}
                    dbo.collection("sap_trans").find(query21,{ projection: { _id:0,__v:0}}).toArray(async function(err11, result11) {
                      if (err11) throw err11;
                       if(result11.length==query21['$or'].length)
                       {
                         for(i=0;i<result11.length;i++)
                         {
                           for(let t=0;t<c.length;t++)
                         {
                           if(result11[i].material==c[t])
                          { var newquery={"material":c[t],"type":{$nin : ["ENGINE", "TRANSMISSION"]}}
                            var newvalues = { $set: {remaining: +(result11[i].remaining)-b[t] } };            
                          dbo.collection("sap_trans").updateOne(newquery, newvalues, function(err, res) {
                          if (err) throw err;
                          console.log("1 document updated");                  
                          });
                          if(i==result11.length-1)
                           myresolve(1)
                        }
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

        let d1=await prom
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

    var myPromise1001= new Promise(async function(myResolve, myReject) {

      MongoClient.connect(url, async function(err, db) {
        if (err) throw err;
        var dbo = db.db("sdf_project_ver2");
        var query21={"material":req.body.PartNumber[0],"type":{$nin : ["ENGINE", "TRANSMISSION"]}}
        dbo.collection("sap_trans").find(query21,{ projection: { _id:0}}).toArray(async function(err, result) {
          if (err) throw err;
          if(result.length!=0)
           {    
             myResolve(result[0].desc)
           }
           else
           return res.json("PNo Not in PO")
  })
})
})

    var options = { method: 'POST',
    url: printerip+'/others',
    headers: 
     { 
       'content-type': 'application/x-www-form-urlencoded' },
    form: 
     {
        PackingType : 'Otherparts',//
        Quantity: req.body.PartNumber.length,//
        BatchNo : 'lot1',//
        BoxNo :await myPromise,//
        PackedBy: req.body.Operator,//
        qrcode: await myPromise,//
        PartNo:req.body.PartNumber[0],
        PartDesc:await myPromise1001,
        Weight: req.body.Netweight, 
     } 
    };
  
    //  request(options, function (error, response, body) {
    //   if (error) console.log( error)
    // });

  
        const otherparts = new otherparts1({
            Datenow:getISTTime(),
            packageType: 'Otherparts',
            PartNumber:req.body.PartNumber,
            GrossWeight:req.body.GrossWeight, 
            Box_Type:req.body.Box_Type, 
            Box_Name:req.body.Box_Name, 
            lenght:req.body.lenght,
            breadth:req.body.breadth, 
            height:req.body.height, 
            Boxweight:req.body.Boxweight,   
            Netweight:req.body.Netweight, 
            boxNo:await myPromise,
            Transport:req.body.Transport,
            Operator:req.body.Operator            
          })
          const a1 =  await otherparts.save()
         return res.json('Generated Boxid - ' +await myPromise)
    
    })
    
    router.get('/table', async (req,res) => {
        console.log("otherparts-table")
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
                  var mysort = { Datenow: -1 };

            dbo.collection("otherparts").find(query,{ projection: { _id:0}}).sort(mysort).toArray(async function(err, result) {
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



    router.get('/excel', async (req,res) => {
        console.log("otherparts-excel")
        var b=[],c=[];
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
        let d100=new Promise(function(myResolve, myReject) {MongoClient.connect(url, async function(err, db) {
            if (err) throw err;
            var dbo = db.db("sdf_project_ver2");
            dbo.collection("otherparts").find(query,{ projection: { _id:0}}).toArray(async function(err, result) {
                if (err) throw err;
                if(result.length!=0)
                 {    
                    b=result
                    myResolve(1)
                 }
                else
                { return res.json("No data")
                }
                })
            })   
    
        })
        let d1= await d100
        let d1001=new Promise(function(myResolve, myReject) {MongoClient.connect(url, async function(err, db) {
          if (err) throw err;
          var dbo = db.db("sdf_project_ver2");
          dbo.collection("sap_weight_trans1").find({},{ projection: { _id:0}}).toArray(async function(err, result323) {
              if (err) throw err;
              if(result323.length!=0)
               {    
                  c=result323
                  myResolve(1)
               }
               else
               {
                 console.log(32)
               }
              })
          })   
  
      })
      let d12= await d1001
        var workbook=await excelOp(b,c)
        res.setHeader('Access-Control-Expose-Headers', "Content-Disposition"); 
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=" +"Otherparts_Summary_Report.xlsx");
         return workbook.xlsx.write(res)
             .then(function(){
                 res.end();
             });
           })
       
    

module.exports = router