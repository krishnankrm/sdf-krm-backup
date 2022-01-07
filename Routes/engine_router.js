const express = require('express')
const router = express.Router()
var config = require('../config');
const url = config.url
const axios=require('axios')
const printerip = config.printerip
const Engine1 = require('../models/Engine')
var Excel = require('exceljs');
var MongoClient = require('mongodb').MongoClient;
var request = require("request");

async function excelOp(cylindertype) {
    let workbook = new Excel.Workbook();
    workbook = await workbook.xlsx.readFile('./ExcelList/Worksheet in Software integration for CKD.xlsx'); 
    let worksheet = workbook.getWorksheet('Sheet1'); 
    var excelrowindex=[2,3,4],returnval=[]
    for (let k in excelrowindex)
{   
    returnval.push(worksheet.getRow(excelrowindex[k]).getCell(cylindertype).value)
}    
return(returnval)
}
const getISTTime = () => {
    let d = new Date()
    return d.getTime() + ( 5.5 * 60 * 60 * 1000 )
  }

router.post('/', async(req,res) => {
    console.log("engine-post")
    
  var prom=new Promise((myresolve,reject)=>{
    MongoClient.connect(url, function(err, db) {
            var dbo = db.db("sdf_project_ver2");
            var query21={"material":req.body.part_number,"type":"ENGINE","remaining":{$ne: 0}}
            dbo.collection("sap_trans").find(query21,{ projection: { _id:0,__v:0}}).toArray(async function(err11, result11) {
                if (err11) throw err11;
                if(result11.length!=0)
                {  var newvalues = { $set: {remaining: +(result11[0].remaining)-1 } };            
                dbo.collection("sap_trans").updateOne(query21, newvalues, function(err, res) {
                  if (err) throw err;
                  console.log("1 document updated");
                  myresolve(1)
                });
                }
                else
                {   
                  res.json("P/N not available in PO for the required quantity")
                }
          });
        });
  })
let d1=await prom

    var excelcylinderdetails;
    if(req.body.engine_type=='3')
    excelcylinderdetails=await excelOp("B")
    else     if(req.body.engine_type=='4')
    excelcylinderdetails=await excelOp("C")
    dimension=excelcylinderdetails[0]
    dimensionarray=dimension.split('X')
    let myPromise = new Promise(async function(myResolve, myReject) {
      //Used for generating boxnumber from the list
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
      let d101=new Promise(async function(myResolve, myReject) {
        //used to infer db of the last number
        MongoClient.connect(url, async function(err, db) {
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
      //Used to take the part description for part label
      MongoClient.connect(url, async function(err, db) {
        if (err) throw err;
        var dbo = db.db("sdf_project_ver2");
        var query21={"material":req.body.part_number,"type":"ENGINE"}
        dbo.collection("sap_trans").find(query21,{ projection: { _id:0}}).toArray(async function(err, result) {
          if (err) throw err;
          if(result.length!=0)
           {    
             myResolve(result[0].desc)
           }
           else
           {
            myResolve("Data not in PO")
           }
  })
})
})
    var options = { method: 'POST',
        url:printerip+'/enginebox',
        headers: 
         { 
           'content-type': 'application/x-www-form-urlencoded' },
        form: 
         {
          PackingType:"Engine",
          BoxNo : await myPromise,
          PartNo :req.body.part_number, 
          engSerNo :req.body.engine_serial_number,
          PackedBy:req.body.Operator ,  //         
          qrcode :await myPromise,//
          BatchNo:"lot1",//
          Quantity:'1',
          PartDesc:await myPromise1001,

         } };


        //  request(options, function (error, response, body) {
        //   if (error) console.log( error)
        //  });
 
    const Engine = new Engine1({
        Datenow:getISTTime(),
        packageType: 'Engine',
        engineType:req.body.engine_type,
        serial_number:req.body.engine_serial_number,
        Pno:req.body.part_number, 
        Sap:req.body.SAP_serial_number, 
        BoxNo:await myPromise,
        Transport:req.body.Transport,
        Length:dimensionarray[0].trim(' '),
        Width:dimensionarray[1].trim(' '),
        Height:dimensionarray[2].trim(' '),
        Gross_weight:req.body.Gross_weight,
        Net_weight:req.body.Net_weight,
        Tare_weight:req.body.Tare_weight,
        Operator:req.body.Operator       
      })
      
    const a1 =  await Engine.save()
    return res.json('Generated Boxid - '+await myPromise)


})

router.get('/daytable1', async(req,res) => {
    console.log('engine table')
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
         dbo.collection("engines").find(query,{ projection: { _id:0}}).toArray(async function(err, result) {
             if (err) throw err;
             if(result.length!=0)
              {    
                result.map(itm=>{
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

 router.get('/excel', async(req,res) => {
  console.log('engine excel')
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
      dbo.collection("engines").find(query,{ projection: { _id:0}}).toArray(async function(err, result) {
           if (err) throw err;
           if(result.length!=0)
            {                
              var workbook=await excelfn(result)
              res.setHeader('Access-Control-Expose-Headers', "Content-Disposition"); 
              res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
              res.setHeader("Content-Disposition", "attachment; filename=" +"Engine_Summary_Report.xlsx");
               return workbook.xlsx.write(res)
                   .then(function(){
                       res.end();
                   });                        
            }
            else
            return res.json("No data")
 
           })
       })         
             
})

async function excelfn(profile){
  let workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet("My Sheet",{properties:{tabColor:{argb:'FF00FF00'}}});
  worksheet.columns = [

   {width: 15,outlineLevel: 1},

 ];

  worksheet.mergeCells('B3:D3');

  worksheet.mergeCells('B4:J5');

  worksheet.mergeCells('B6:J6');

  worksheet.mergeCells('B7:C7');

  worksheet.mergeCells('D7:F7');

  worksheet.mergeCells('G7:J7');

  worksheet.mergeCells('B8:C8');

  worksheet.mergeCells('D8:F8');

  worksheet.mergeCells('G8:J8');

  worksheet.mergeCells('B9:C9');

  worksheet.mergeCells('D9:F9');

  worksheet.mergeCells('G9:J9');

  worksheet.mergeCells('B10:C10');

  worksheet.mergeCells('D10:F10');

  worksheet.mergeCells('G10:J10');
  var i = 0;

  profile.forEach((entry, index, array) => {

      var partNo = entry.Pno;

      var serialNo = entry.serial_number;

      var sapSerial = entry.Sap;

      var BoxNo = entry.BoxNo;

      var Net_weight = entry.Net_weight;

      var Gross_weight = entry.Gross_weight;

      var Length = entry.Length

      var Width = entry.Width;

      var Height = entry.Height;

   
      var borderStyles = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };

       // add column headers

     //  var worksheet =  workbook.getWorksheet(1);

       const nameCol = worksheet.getColumn('E');

       nameCol.width = 20;

       const nameCol1 = worksheet.getColumn('C');

       nameCol1.width = 15;
       worksheet.getColumn('A').width = 1;

       worksheet.getColumn('B').width = 7;
       worksheet.getColumn('G').width = 14;
       worksheet.getColumn('D').width = 14;
       worksheet.getColumn('E').width = 14;
       worksheet.getColumn('J').width = 17;

       var feet = worksheet.getRow(2);     
       feet.getCell(2).value = "20 FEET"
       feet.getCell(2).font = {size: 24,bold:true,color: { argb: 'FF0000' },name: 'Calibri'};
      //  feet.getCell(3).font = {size: 24,bold:true,color: { argb: 'FF0000' },name: 'Calibri'};

      // feet.getCell(5).alignment = { vertical: 'center', horizontal: 'center' };

           

       worksheet.getCell('B3').value = 'packing cost :';

       worksheet.getCell('B3').font = {size: 16,bold:true,name: 'Calibri'};

       

       worksheet.getCell('G5').value = 'SAME DEUTZ-FAHR INDIA (P) LTD \nCKD CONTAINER CHECK LIST';

       var compName = worksheet.getRow(5);

       compName.getCell(5).alignment = { vertical: 'middle', horizontal: 'center',wrapText: true };

       compName.getCell(5).font = {name: 'Calibri',bold:true};



       worksheet.getCell('G6').value = 'CUSTOMER : TURKEY ';

       var country = worksheet.getRow(6);

       country.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };

       country.getCell(5).font = {name: 'Calibri',bold:true};



       worksheet.getCell('C7').value = 'TRAILER NUMBER';

       var trailerNO = worksheet.getRow(7);

       trailerNO.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };

       trailerNO.getCell(3).font = {name: 'Calibri',bold:true,size:10};



       worksheet.getCell('C8').value = 'CONTAINER NUMBER';

       var trailerNO = worksheet.getRow(8);

       trailerNO.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };

       trailerNO.getCell(3).font = {name: 'Calibri',bold:true,size:10};



       worksheet.getCell('C9').value = 'CONTAINER SEAL NUMBER';

       var ContainerNo = worksheet.getRow(9);

       ContainerNo.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };

       ContainerNo.getCell(3).font = {name: 'Calibri',bold:true,size:10};



       worksheet.getCell('C10').value = 'DATE';

       var date = worksheet.getRow(10);

       date.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };

       date.getCell(3).font = {name: 'Calibri',bold:true,size:10};



       var dateAdd = worksheet.getRow(10);

       dateAdd.getCell(4).value = new Date()

       dateAdd.getCell(4).alignment = { vertical: 'center', horizontal: 'center' };

       dateAdd.getCell(4).font = {name: 'Calibri',color: { argb: '33ccff' },bold:true,size:16,};



       var tableItems = worksheet.getRow(11);

       tableItems.getCell(2).value = "SrNo"

       tableItems.getCell(3).value = "PART No"

       tableItems.getCell(4).value = "ENGINE SERIAL NO"

       tableItems.getCell(4).alignment = { vertical: 'middle', horizontal: 'justify' };

       tableItems.getCell(5).value = "SAP SERIAL NUMBER"

       tableItems.getCell(5).alignment = { vertical: 'middle', horizontal: 'justify' };

       tableItems.getCell(6).value = "DELIVERY NUMBER"

       tableItems.getCell(6).alignment = { vertical: 'middle', horizontal: 'justify' };

       tableItems.getCell(7).value = "BOX NO"

       tableItems.getCell(8).value = "NT WT"

       tableItems.getCell(9).value = "GROSS WT"

       tableItems.getCell(9).alignment = { vertical: 'middle', horizontal: 'justify' };

       tableItems.getCell(10).value = "DIMENSION"       

       var row = worksheet.getRow(12+i);

       row.getCell(2).value = (i+1).toString();

       row.getCell(3).value = partNo.toString();

       row.getCell(4).value = serialNo.toString();

       row.getCell(5).value = sapSerial.toString();

       row.getCell(7).value = BoxNo.toString();

       row.getCell(8).value = Net_weight.toString();

       row.getCell(9).value = Gross_weight.toString();

       row.getCell(10).value = Length.toString()+'*'+Width.toString()+'*'+Height.toString()




       if(index === (array.length -1)){
       var count = worksheet.getRow(13+index);
       worksheet.getRow(13+index).outlineLevel = 10;
       var col = 'D'+(13+index)+':J'+(13+index)
       worksheet.mergeCells(col);
       count.getCell(4).value = "PACKAGES  : "+(i+1)+"  CARTON BOXES WITH WOODEN PALLET"
       count.getCell(4).font = {size: 16,bold:true};
       count.getCell(4).alignment = { vertical: 'middle', horizontal: 'justify' };
       const imageId2 = workbook.addImage({
        filename: './ExcelList/Excel_logo.png',
        extension: 'png',
      });

       var col1 = 'C'+(14+index)+':C'+(15+index)
       worksheet.addImage(imageId2,col1)
      
       worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
         if(rowNumber>=4)
         row.eachCell({ includeEmpty: false }, function(cell, colNumber) {
           cell.border = borderStyles;
         });
       });
       }
       i = i+1;
       });
       return(workbook)
     }

module.exports = router;
