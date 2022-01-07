const express = require('express')
const router = express.Router()
var config = require('../config');
const url = config.url
var MongoClient = require('mongodb').MongoClient;
const transmission1 = require('../models/transmission')
var Excel = require('exceljs');
var request = require("request");
const printerip=config.printerip

const getISTTime = () => {
    let d = new Date()
    return d.getTime() + ( 5.5 * 60 * 60 * 1000 )
  }
var cellborderStyles = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" }
  };
  var leftborderStyles = {
    left: { style: "medium" },
   
  };
  var bottomborderStyles = {
    bottom: { style: "medium" },
  };
  var leftbottomborderStyles = {
    bottom: { style: "medium" },
    left: { style: "medium" },

  };
  var rightbottomborderStyles = {
    bottom: { style: "medium" },
    right: { style: "medium" }

  };
  var purerightborderStyles = {
    
    right: { style: "medium" }
  };
  var rightborderStyles = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "medium" }
  };
async function excelOp(array) {
    var local_model=[], local_Sap=[],local_StackNo=[],boxno=[],net_weight=[],r=1;
    for (var i = 0; i <array.length ; i++) 
    {      
        for (var j = 0; j <array[i].ModelNo.length ; j++) 
        {   
            local_model.push(array[i].ModelNo[j])
            local_Sap.push(array[i].Sap[j])
            if(j==0)
            {local_StackNo.push(array[i].StackNo)
            boxno.push(array[i].boxNo)
            net_weight.push(array[i].net_weight)}
            else
           {    local_StackNo.push(' ')
            boxno.push(' ')
            net_weight.push(' ')}
        }
    }
       
    let workbook = new Excel.Workbook();
    workbook = await workbook.xlsx.readFile('./ExcelList/Transmission.xlsx'); 
    let worksheet = workbook.getWorksheet('Sheet1');
        
    const imageId = workbook.addImage({
        filename: './ExcelList/Excel_logo.png',
        extension: 'png',
      });
    
    for (var i = 0; i <local_model.length ; i++) 
    {  
        if(local_StackNo[i+1]==' ')
        {
            worksheet.mergeCells('F'+(14+i)+':F'+(15+i));
            worksheet.mergeCells('G'+(14+i)+':G'+(15+i));
            worksheet.mergeCells('H'+(14+i)+':H'+(15+i));
            worksheet.mergeCells('C'+(14+i)+':C'+(15+i));
        }
        
        worksheet.getRow((14+i).toString()).getCell('D').value = local_model[i];
        worksheet.getRow((14+i).toString()).getCell('E').value = local_Sap[i];
        if(local_StackNo[i]!=' ')
       { worksheet.getRow((14+i).toString()).getCell('C').value = r;
       r++;
         worksheet.getRow((14+i).toString()).getCell('F').value = local_StackNo[i];
        worksheet.getRow((14+i).toString()).getCell('G').value = boxno[i];
        worksheet.getRow((14+i).toString()).getCell('H').value = net_weight[i];
      }
        worksheet.getRow((14+i).toString()).getCell('C').font = {           name: 'Arial', size: 12         };
        worksheet.getRow((14+i).toString()).getCell('D').font = {           name: 'Arial', size: 12         };
        worksheet.getRow((14+i).toString()).getCell('E').font = {           name: 'Arial', size: 12         };
        worksheet.getRow((14+i).toString()).getCell('F').font = {           name: 'Arial', size: 12         };
        worksheet.getRow((14+i).toString()).getCell('G').font = {           name: 'Arial', size: 12         };
        worksheet.getRow((14+i).toString()).getCell('H').font = {           name: 'Arial', size: 12         };

        worksheet.getRow((14+i).toString()).getCell('C').border = cellborderStyles
        worksheet.getRow((14+i).toString()).getCell('D').border = cellborderStyles
        worksheet.getRow((14+i).toString()).getCell('E').border = cellborderStyles
        worksheet.getRow((14+i).toString()).getCell('F').border = cellborderStyles
        worksheet.getRow((14+i).toString()).getCell('G').border = cellborderStyles
        worksheet.getRow((14+i).toString()).getCell('B').border = leftborderStyles
        worksheet.getRow((14+i).toString()).getCell('H').border = cellborderStyles
        worksheet.getRow((14+i).toString()).getCell('H').border = rightborderStyles
        if(i==local_model.length-1)
        {  
            worksheet.getRow((14+i+1).toString()).getCell('B').border = leftborderStyles
            worksheet.getRow((14+i+1).toString()).getCell('H').border = purerightborderStyles
            worksheet.getRow((14+i+2).toString()).getCell('B').border = leftborderStyles
            worksheet.getRow((14+i+2).toString()).getCell('H').border = rightborderStyles
            worksheet.getRow((14+i+3).toString()).getCell('B').border = leftborderStyles
            worksheet.getRow((14+i+3).toString()).getCell('H').border = rightborderStyles
            worksheet.getRow((14+i+4).toString()).getCell('B').border = leftborderStyles
            worksheet.getRow((14+i+4).toString()).getCell('H').border = rightborderStyles
            worksheet.getRow((14+i+5).toString()).getCell('B').border = leftborderStyles
            worksheet.getRow((14+i+5).toString()).getCell('H').border = purerightborderStyles
            worksheet.getRow((14+i+6).toString()).getCell('B').border = leftborderStyles
            worksheet.getRow((14+i+6).toString()).getCell('H').border = purerightborderStyles
            worksheet.getRow((14+i+7).toString()).getCell('B').border = leftborderStyles
            worksheet.getRow((14+i+7).toString()).getCell('H').border = purerightborderStyles

            worksheet.getRow((14+i+8).toString()).getCell('B').border = leftbottomborderStyles
            worksheet.getRow((14+i+8).toString()).getCell('H').border = rightbottomborderStyles
            worksheet.mergeCells('F'+(14+i+2)+':G'+(14+i+2));
            worksheet.getRow((14+i+2).toString()).getCell('C').border = cellborderStyles
            worksheet.getRow((14+i+2).toString()).getCell('D').border = cellborderStyles
            worksheet.getRow((14+i+2).toString()).getCell('E').border = cellborderStyles
            worksheet.getRow((14+i+2).toString()).getCell('F').border = cellborderStyles
            worksheet.getRow((14+i+3).toString()).getCell('F').border = cellborderStyles
            worksheet.getRow((14+i+3).toString()).getCell('G').border = cellborderStyles
            worksheet.getRow((14+i+3).toString()).getCell('C').border = cellborderStyles
            worksheet.getRow((14+i+3).toString()).getCell('D').border = cellborderStyles
            worksheet.getRow((14+i+3).toString()).getCell('E').border = cellborderStyles
            worksheet.getRow((14+i+4).toString()).getCell('F').border = cellborderStyles
            worksheet.getRow((14+i+4).toString()).getCell('G').border = cellborderStyles
            worksheet.getRow((14+i+4).toString()).getCell('C').border = cellborderStyles
            worksheet.getRow((14+i+4).toString()).getCell('D').border = cellborderStyles
            worksheet.getRow((14+i+4).toString()).getCell('E').border = cellborderStyles
            worksheet.getRow((14+i+2).toString()).getCell('D').value = 'LOOSE PARTS'
            worksheet.getRow((14+i+2).toString()).getCell('F').value = 'BOX QTY'
            worksheet.getRow((14+i+3).toString()).getCell('D').value = 'NIL'
            worksheet.getRow((14+i+3).toString()).getCell('F').value = 'NIL'
            worksheet.getRow((14+i+2).toString()).getCell('D').font = {            name: 'Arial', size: 12,          };
            worksheet.getRow((14+i+2).toString()).getCell('C').font = {            name: 'Arial', size: 12,          };
            worksheet.getRow((14+i+2).toString()).getCell('F').font = {            name: 'Arial', size: 12,          };
            worksheet.getRow((14+i+3).toString()).getCell('D').font = {            name: 'Arial', size: 12,          };
            worksheet.getRow((14+i+3).toString()).getCell('F').font = {            name: 'Arial', size: 12,          };
            worksheet.getRow((14+i+2).toString()).getCell('C').alignment = { horizontal:'center'} ;
            worksheet.getRow((14+i+2).toString()).getCell('F').alignment = { horizontal:'center'} ;
            worksheet.getRow((14+i+3).toString()).getCell('D').alignment = { horizontal:'center'} ;
            worksheet.getRow((14+i+3).toString()).getCell('F').alignment = { horizontal:'center'} ;
            // worksheet.getRow((14+i+).toString()).getCell('F').alignment = { horizontal:'center'} ;
            // worksheet.getRow((14+i+3).toString()).getCell('F').alignment = { horizontal:'center'} ;
            worksheet.addImage(imageId, 'C'+(14+i+6).toString()+':C'+(14+i+7).toString());
            worksheet.getRow((13+i+9).toString()).getCell('C').border = bottomborderStyles
            worksheet.getRow((13+i+9).toString()).getCell('D').border = bottomborderStyles
            worksheet.getRow((13+i+9).toString()).getCell('E').border = bottomborderStyles
            worksheet.getRow((13+i+9).toString()).getCell('F').border = bottomborderStyles
            worksheet.getRow((13+i+9).toString()).getCell('G').border = bottomborderStyles

        }

    }
 
    return(await workbook);

}

router.post('/post', async (req,res) => {
    console.log("transmission-post")
  
    var prom=new Promise((myresolve,reject)=>{

      MongoClient.connect(url, function(err, db) {
              var dbo = db.db("sdf_project_ver2");
              var a=[],b=[],c=[];
              const counts = {};
              const sampleArray = req.body.Model;
              sampleArray.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
              console.log("counts",counts)

              for (var key in counts){
                a.push({"material":key,"type":"TRANSMISSION","remaining":{$gte: counts[key]}})
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
                    { var newquery={"material":c[t],"type":"TRANSMISSION"}
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
      {
      case 1: month='TJAN'; break;
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
    const Trans = new transmission1({
        Datenow:getISTTime(),
        packageType: 'Transmission',
        StackNo:req.body.StackNo,
        ModelNo:req.body.Model, 
        Sap:req.body.Sap, 
        Transport:req.body.Transport,
        boxNo:await myPromise,
        Operator:req.body.Operator,
        net_weight:req.body.net_weight,
        gross_weight:req.body.gross_weight,
        tare_weight:req.body.tare_weight,
      })
      let quantity=typeof req.body.Model[1]=='undefined'?'1':'2'
      let part1=typeof req.body.Model[1]=='undefined'?'-':req.body.Model[1]
  
      const a1 =  await Trans.save()

      var myPromise1001= new Promise(async function(myResolve, myReject) {
        //used for part description
        MongoClient.connect(url, async function(err, db) {
          if (err) throw err;
          var dbo = db.db("sdf_project_ver2");
          var query21={"material":req.body.Model[0],"type":"TRANSMISSION"}
          dbo.collection("sap_trans").find(query21,{ projection: { _id:0}}).toArray(async function(err, result) {
            if (err) throw err;
            if(result.length!=0)
             {    
               console.log(result[0].desc)
               myResolve(result[0].desc)
             }
             else
             {    
               myResolve("Part No. not in PO")
             }
            })
          })
          })



      var options = { method: 'POST',
      url: printerip+'/transmission',
      headers: 
       { 
         'content-type': 'application/x-www-form-urlencoded' },
      form: 
       {
        PartNo1: req.body.Model[0],//
        PackingType: 'Transmission',
        Quantity:quantity,//
        BatchNo: 'Oct-10e',
        BoxNo: await myPromise,//
        PackedBy: req.body.Operator,//
        qrcode: await myPromise,//
        PartNo2: part1,//
        PartDesc:await myPromise1001
       } };
    
       request(options, function (error, response, body) {
        if (error) console.log( error)
      });

      return res.json('Generated Boxid - ' +await myPromise)

})


router.get('/table', async (req,res) => {
    console.log("transmission-table")
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
        dbo.collection("transmissions").find(query,{ projection: { __v:0,_id:0}}).toArray(async function(err, result) {
            if (err) throw err;
            if(result.length!=0)
             {      result.map(itm=>{
              let newdt= itm.Datenow.toISOString().split('T')
              itm.Datenow=newdt[0]
              return itm          })
                return res.json(result)
             }
            else
             return res.json("No data")
            })
        })   


})

router.get('/excel', async (req,res) => {
    console.log("transmission-excel")
    var b=[]
    let d100=new Promise(function(myResolve, myReject) {MongoClient.connect(url, async function(err, db) {
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
        dbo.collection("transmissions").find(query,{ projection: { _id:0}}).toArray(async function(err, result) {
            if (err) throw err;
            if(result.length!=0)
             {    
                b=result
                myResolve(1)
             }
            else
             return res.json("No data")
            })
        })   

    })
    let d1= await d100
    var workbook=await excelOp(b)
    res.setHeader('Access-Control-Expose-Headers', "Content-Disposition"); 
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader("Content-Disposition", "attachment; filename=" +"Transmission_Summary_Report.xlsx");
     return workbook.xlsx.write(res)
         .then(function(){
             res.end();
         });
       })
   


module.exports = router